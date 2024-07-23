<script lang="ts">
	import '@hotosm/ui/dist/components'
	import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group.component.js' 
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store'
	import { MapLibre, GeoJSON, FillLayer, LineLayer, hoverStateFilter } from 'svelte-maplibre';
	import type { FeatureCollection } from 'geojson';
	import { polygon } from '@turf/helpers';
	import { buffer } from '@turf/buffer';
	import { bbox } from '@turf/bbox';

	import type { ProjectData, ProjectTask, ZoomToTaskEventDetail } from '$lib/types';
	import { type Electric } from '$lib/migrations';
	import { mapTask, finishTask, validateTask, goodTask, commentTask } from '$lib/task-events';
	import { createLiveQuery } from '$lib/live-query';
	import { generateQrCode, downloadQrCode } from '$lib/qrcode'
	import EventCard from '$lib/components/event-card.svelte'; 

	export let data: PageData;
	// $: ({ electric, project } = data)
	let map: maplibregl.Map | undefined;
	let loaded: boolean;
	let tabGroup: SlTabGroup

	let selectedTab: string = 'map';
	let panelDisplay: string = 'none';
	$: panelDisplay = selectedTab === 'map' ? 'none' : 'block';

	// let electric: Electric = data.electric;
	let electricSyncKey: string
	const taskHistory = data.electric.db.task_history.liveMany({
		select: { action: true, action_text: true, action_date: true, task_id: true },
		where: { project_id: data.projectId },
		orderBy: {
			action_date: 'desc'
		},
	});
	let history = createLiveQuery(data.electric.notifier, taskHistory)
	$: if ($history) {
		updateTaskFeatures();
	}

	$: qrCodeData = generateQrCode(data.project.project_info.name, data.project.odk_token, "TEMP");
	let taskFeatcol: FeatureCollection = { type: 'FeatureCollection', features: [] }
	const taskFeatcolStore = writable<FeatureCollection>(taskFeatcol)
	let selectedTaskId = writable<number | null>(null)
	let selectedTask = writable<any>(null);
	$: selectedTask = data.project.tasks.find((task: ProjectTask) => task.id === $selectedTaskId)
	let nextAction = writable<string>('');
	$: (async() => $nextAction = await getStatusFromTaskHistory($selectedTask))();
	// $: {(async () => {
	// 	const task = $selectedTask;
	// 	console.log(task)
	// 	if (task && task.id) {
	// 		const status = await getStatusFromTaskHistory(task.id);
	// 		// TODO get next action in sequence here
	// 		nextAction.set(status);
	// 	} else {
	// 		nextAction.set('');
	// 	}
	// 	})();
	// }

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


	function zoomToTask(event: CustomEvent<ZoomToTaskEventDetail>) {
		const taskId = event.detail.taskId;
		const taskObj = data.project.tasks.find((task: ProjectTask) => task.id === taskId);

		if (!taskObj) return

		const taskPolygon = polygon(taskObj.outline_geojson.geometry.coordinates);
		const taskBuffer = buffer(taskPolygon, 5, { units: 'meters' });
		if (taskBuffer && map) {
			const taskBbox: [number, number, number, number] = bbox(taskBuffer) as [number, number, number, number];
			map.fitBounds(taskBbox, { duration: 500 });
		}

		// Open the map tab
		tabGroup.show('map')
	}

	onMount(async () => {
		const projectPolygon = polygon(data.project.outline_geojson.geometry.coordinates);
		const projectBuffer = buffer(projectPolygon, 100, { units: 'meters' });
		if (projectBuffer && map) {
			const projectBbox: [number, number, number, number] = bbox(projectBuffer) as [number, number, number, number];
			map.fitBounds(projectBbox, { duration: 0 });
		}

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

	async function updateTaskFeatures() {
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

		taskFeatcolStore.set({
		type: 'FeatureCollection',
		features: features,
		});
	}

	// onDestroy(() => {
	// 	// This will delete all related rows locally
	// 	data.electric.sync.unsubscribe([electricSyncKey])
	// })
</script>

{#if $history}
	<hot-card id="notification-banner" class="absolute z-10 top-18 right-0 font-sans hidden sm:flex">
		Latest: { $history[0].action_text }
	</hot-card>
{/if}

{#if $selectedTaskId && $nextAction}
	<sl-tooltip content={$nextAction}>
		<hot-icon-button
		name="fast-forward-circle"
		class="fixed top-30 left-1/2 transform -translate-x-1/2 text-5xl z-10"
		label={$nextAction}
		></hot-icon-button>
	</sl-tooltip>
{/if}

<MapLibre
	bind:map
	bind:loaded
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
	class="flex-auto w-full sm:aspect-video sm:max-h-full"
	standardControls
	center={[0, 0]}
	zoom={2}
	attributionControl={false}
>
	<GeoJSON id="states" data={$taskFeatcolStore} promoteId="TASKS">
			<FillLayer
				hoverCursor="pointer"
				paint={{
					'fill-color': [
						'match', ['get', 'status'],
						'0', '#c5fbf5',
						'1', '#ff0000',
						'2', '#66ff33',
						'3', '#ff9900',
						'#c5fbf5' // default color if no match is found
					],
					'fill-opacity': hoverStateFilter(0.5, 0),
				}}
				beforeLayerType="symbol"
				manageHoverState
				on:click={(e) => {
						selectedTaskId.set(e.detail.features?.[0]?.properties?.uid);
				}}  
			/>
			<LineLayer
				layout={{ 'line-cap': 'round', 'line-join': 'round' }}
				paint={{ 
					'line-color': hoverStateFilter('#0fffff', '#0fffff'),
					'line-width': 3 
				}}
				beforeLayerType="symbol"
				manageHoverState
			/>
	</GeoJSON>
</MapLibre>

<sl-tab-group
	placement="bottom"
	no-scroll-controls
	on:sl-tab-show={(e) => selectedTab = e.detail.name}
	style="--panel-display: {panelDisplay};"
	bind:this={tabGroup}
>
	<!-- Map tab: panel is hidden to display the map below it -->
	<sl-tab-panel name="map"></sl-tab-panel>
	
	<!-- Task events tab -->
	<sl-tab-panel name="events">
		{#if $history}
			{#each $history as record}
				<EventCard
					record={record}
					highlight={record.task_id === $selectedTaskId}
					on:zoomToTask={(e) => zoomToTask(e)}
				></EventCard>
			{/each}
		{/if}
	</sl-tab-panel>
	
	<!-- Offline mode tab -->
	<sl-tab-panel name="offline">
		TODO stuff here
	</sl-tab-panel>
	
	<!-- QRCode tab -->
	<sl-tab-panel name="qrcode">
		<div class="flex flex-col items-center justify-center h-full p-4 space-y-4">
			<!-- Text above the QR code -->
			<div class="text-center w-full">
				<div class="h-12 font-bold text-lg">
					Scan this QR Code in ODK Collect
				</div>
			</div>

			<!-- QR Code Container -->
			<div class="flex justify-center w-full max-w-sm">
				<hot-qr-code
					value={qrCodeData}
					label="Scan to open ODK Collect"
					size="300"
					radius="0.5"
					errorCorrection="L"
				></hot-qr-code>
			</div>

			<!-- Download Button -->
			<div class="w-full max-w-sm text-center">
				<hot-icon-button
					name="download"
					label="Download QRCode"
					on:click={downloadQrCode(data.project.project_info.name, qrCodeData)}
				>Download</hot-icon-button>
			</div>

			<!-- Open ODK Button -->
			<div class="w-full max-w-sm text-center">
				<sl-button
					href="odkcollect://form/{data.project.xform_id}{$selectedTaskId ? `?task_filter=${$selectedTaskId}` : ''}"
				>Open ODK</sl-button>
			</div>
		</div>
	</sl-tab-panel>

	<sl-tab slot="nav" panel="map">
		<hot-icon name="map"></hot-icon>
	</sl-tab>
	<sl-tab slot="nav" panel="events">
		<hot-icon name="list"></hot-icon>
	</sl-tab>
	<sl-tab slot="nav" panel="offline">
		<hot-icon name="wifi-off"></hot-icon>
	</sl-tab>
	<sl-tab slot="nav" panel="qrcode">
		<hot-icon name="qr-code"></hot-icon>
	</sl-tab>
</sl-tab-group>

<style>
	:root {
		--nav-height: 4rem;
	}
	/* sl-tab-group {
		bottom: 0;
		width: 100%;
	} */

	/* sl-tab-group::part(base) {
		position: relative;
	} */

	sl-tab-group::part(body) {
		display: var(--panel-display);
		position: fixed;
		bottom: var(--nav-height);
		width: 100%;
		height: calc(80vh - var(--nav-height));
		min-height: 25vh;
		max-height: 90vh;
		background-color: rgba(255, 255, 255, 1);
		overflow: auto;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
		z-index: 100;  /* Map is using z-index 10 */
	}

	/* The tab selector */
	sl-tab-group::part(nav) {
		display: flex;
		justify-content: center;
		background-color: var(--hot-white);
		height: var(--nav-height);
	}

	/* The tab active indicator */
	/* sl-tab-group::part(active-tab-indicator) {
	} */

	/* Each tab item (icon) container */
	sl-tab {
		padding-left: 3vw;
		padding-right: 3vw;
	}

	/* The tab item icon */
	hot-icon {
		font-size: 2rem;
	}

	/* Floating map buttons
	hot-icon-button {
		font-size: 2rem;
	} */

	#notification-banner {
		--padding: 0.3rem;
	}
</style>
