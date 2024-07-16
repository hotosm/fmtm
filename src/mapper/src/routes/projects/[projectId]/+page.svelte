<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, GeoJSON, FillLayer, hoverStateFilter } from 'svelte-maplibre';
	import type { GeoJSON as GeoJSONType } from 'geojson';
	import { polygon } from '@turf/helpers';
	import { buffer } from '@turf/buffer';
	import { bbox } from '@turf/bbox';

	import type { ProjectData } from '$lib/types';

	export let data: ProjectData;
	let map: maplibregl.Map | undefined;
	let loaded: boolean;

	// let fillColor = '#ffffff'
	let fillColor = '#c5fbf5';
	let hoverColor = '#0fffff';

	let taskFeatcol: GeoJSONType;
	$: taskFeatcol = {
		type: 'FeatureCollection',
		features: data.tasks.map((x) => {
			return x.outline_geojson;
		}),
	};

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
		const projectPolygon = polygon(data.outline_geojson.geometry.coordinates);
		const projectBuffer = buffer(projectPolygon, 1000, { units: 'meters' });
		const projectBbox: [number, number, number, number] = bbox(projectBuffer) as [number, number, number, number];
		map.fitBounds(projectBbox);
	});
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
				'fill-color': hoverStateFilter(fillColor, hoverColor),
				'fill-opacity': 0.5,
			}}
			beforeLayerType="symbol"
			manageHoverState
		/>
	</GeoJSON>
</MapLibre>
