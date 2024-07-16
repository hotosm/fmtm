<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { MapLibre, GeoJSON, FillLayer, LineLayer, hoverStateFilter } from 'svelte-maplibre';
	import type { FeatureCollection } from 'geojson';
	import { polygon } from '@turf/helpers';
	import { buffer } from '@turf/buffer';
	import { bbox } from '@turf/bbox';

	import type { ProjectData, ProjectTask } from '$lib/types';
	import { type Electric } from '$lib/migrations';
	import { mapTask, finishTask, validateTask, goodTask, commentTask } from '$lib/task-events';
	import { createLiveQuery } from '$lib/live-query';

	export let data: PageData;
	// $: ({ electric, project } = data)
	let map: maplibregl.Map | undefined;
	let loaded: boolean;
	// let fillColor = '#ffffff'
	let fillColor = '#c5fbf5';
	let strokeColor = '#0fffff';

	// let electric: Electric = data.electric;
	let electricSyncKey: string
	const taskHistory = data.electric.db.task_history.liveMany({
		select: { action_date: true, action: true },
		where: {
			project_id: data.projectId,
		},
	});
	let history = createLiveQuery(data.electric.notifier, taskHistory)

	const taskComments = data.electric.db.task_history.liveMany({
		select: { action_date: true, action_text: true },
		where: {
			project_id: data.projectId,
			action: 'COMMENT',
		},
	})
	let comments = createLiveQuery(data.electric.notifier, taskComments)

	let taskFeatcol: FeatureCollection = { type: 'FeatureCollection', features: [] }

	async function getStatusFromTaskHistory(taskId: number) {
		const result = await data.electric.db.task_history.findMany({
			select: {
				action: true
			},
			where: {
				task_id: taskId, 
			},
			orderBy: {
				action_date: 'desc'
			},
			take: 1,
		})

		if (result.length === 0) {
			return '0';
		}

		const status = result[0].action;
		if (status === 'LOCKED_FOR_MAPPING') {
			return '1';
		}
		return '0';
	}

	// const mapStyle = {
	// 			"version": 8,
	// 			"name": "OpenStreetMap",
	// 			"sources": {
	// 			"osm": {
	// 				"type": "raster",
	// 				"tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
	// 				"tileSize": 256,
	// 				"attribution": "&copy; OpenStreetMap Contributors",
	// 				"maxzoom": 19
	// 			}
	// 			},
	// 			"layers": [
	// 			{
	// 				"id": "osm",
	// 				"type": "raster",
	// 				"source": "osm"
	// 			}
	// 			]
	// 		}

	onMount(async () => {
		const projectPolygon = polygon(data.project.outline_geojson.geometry.coordinates);
		const projectBuffer = buffer(projectPolygon, 100, { units: 'meters' });
		const projectBbox: [number, number, number, number] = bbox(projectBuffer) as [number, number, number, number];
		map.fitBounds(projectBbox);

		const { key } = await data.electric.db.task_history.sync({
			where: {
				project_id: data.projectId,
			}
		})
		electricSyncKey = key

		const features = await Promise.all(
			data.project.tasks.map(async (x: ProjectTask) => {
				const taskId = x.outline_geojson.id;
				const status = await getStatusFromTaskHistory(taskId);
				return {
					...x.outline_geojson,
					properties: {
						...x.outline_geojson.properties,
						status,
					},
				};
			})
		);

		taskFeatcol = {
			type: 'FeatureCollection',
			features: features,
		};
	});

	$: {
		console.log('History updated:', history);
	}

	// onDestroy(() => {
	// 	// This will delete all related rows locally
	// 	data.electric.sync.unsubscribe([electricSyncKey])
	// })
</script>

<MapLibre
	bind:map
	bind:loaded
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
	class="flex-auto w-full sm:aspect-video sm:max-h-full"
	standardControls
	center={[0, 0]}
	zoom={2}
>
	<GeoJSON id="states" data={taskFeatcol} promoteId="TASKS">
		<FillLayer
			paint={{
				'fill-color': [
					'match', ['get', 'status'],
					'0', '#c5fbf5',
					'1', '#ff0000',
					'2', '#66ff33',
					'3', '#ff9900',
					'#c5fbf5' // default color if no match is found
				],
				'fill-opacity': 0.5,
			}}
			beforeLayerType="symbol"
			manageHoverState
		/>
		<LineLayer
			layout={{ 'line-cap': 'round', 'line-join': 'round' }}
			paint={{ 'line-color': strokeColor, 'line-width': 3 }}
			beforeLayerType="symbol"
		/>
	</GeoJSON>
</MapLibre>

<!-- Add model here with history values -->