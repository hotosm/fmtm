<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PageData } from './$types';

	import { Map } from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	import { type Electric } from '$lib/migrations';
	import { mapTask, finishTask, validateTask, goodTask, commentTask } from '$lib/task-events';
	import { createLiveQuery } from '$lib/live-query';

	export let data: PageData;
	let electric: Electric = data.electric;
	let history;
	let comments;

	let map;
	let mapContainer;

	onMount(async () => {
		await electric.db.task_history.sync();

		const taskHistory = electric.db.task_history.liveMany({
			select: { action_date: true, action: true },
			where: {
				project_id: 1,
			},
		});
		history = createLiveQuery(electric.notifier, taskHistory);

		const taskComments = electric.db.task_history.liveMany({
			select: { action_date: true, action_text: true },
			where: {
				project_id: 1,
				action: 'COMMENT',
			},
		});
		comments = createLiveQuery(electric.notifier, taskComments);

		map = new Map({
			container: mapContainer,
			style: {
				version: 8,
				sources: {
					osm: {
						type: 'raster',
						tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
						tileSize: 256,
						attribution: '&copy; OpenStreetMap Contributors',
						maxzoom: 19,
					},
				},
				layers: [
					{
						id: 'osm',
						type: 'raster',
						source: 'osm',
					},
				],
			},
			center: [139.753, 35.6844],
			zoom: 5,
		});
	});

	onDestroy(() => {
		map.remove();
	});

	const formatDateString = (dateString: string): string => {
		const date = new Date(dateString);
		const day = ('0' + date.getDate()).slice(-2);
		const month = ('0' + (date.getMonth() + 1)).slice(-2);
		const year = date.getFullYear();
		const hours = ('0' + date.getHours()).slice(-2);
		const minutes = ('0' + date.getMinutes()).slice(-2);
		return `${day}/${month}/${year} ${hours}:${minutes}`;
	};
</script>

<div class="map-wrap">
	<div class="map" bind:this={mapContainer}></div>
</div>

<style>
	.map-wrap {
		flex: 1;
		position: relative;
		overflow: hidden; /* Prevent overflow */
		display: flex;
		flex-direction: column; /* Ensure any children are arranged in a column */
	}

	.map {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
	}
</style>
