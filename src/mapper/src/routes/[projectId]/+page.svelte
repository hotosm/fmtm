<script lang="ts">
	import '$styles/page.css';
	import '$styles/button.css';
	import '@hotosm/ui/dist/hotosm-ui';
	import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group.component.js';
	import type { PageData } from '../$types';
	import { onMount, onDestroy } from 'svelte';
	import { polygon } from '@turf/helpers';
	import { buffer } from '@turf/buffer';
	import { bbox } from '@turf/bbox';

	import Error from './+error.svelte';
	import EventCard from '$lib/components/event-card.svelte';
	import BottomSheet from '$lib/components/bottom-sheet.svelte';
	import TaskActionDialog from '$lib/components/task-action-dialog.svelte';
	import MapComponent from '$lib/components/map/main.svelte';

	import type { ProjectData, ProjectTask, ZoomToTaskEventDetail } from '$lib/types';
	import {
		mapTask,
		finishTask,
		resetTask,
		// validateTask,
		// goodTask,
		// commentTask,
	} from '$lib/db/events';
	import { generateQrCode, downloadQrCode } from '$lib/utils/qrcode';
	import { convertDateToTimeAgo } from '$lib/utils/datetime';
	import { 
		latestEventStore,
		taskEventStore,
		getTaskEventStream,
		selectedTaskId,
		selectedTask,
		selectedTaskState,
		subscribeToTaskEvents,
		appendStatesToTaskFeatures,
		getLatestStatePerTask,
	} from '$store/tasks';
	import { 
		entitiesStatusStore,
		selectedEntity,
		getEntityStatusStream,
		subscribeToEntityStatusUpdates,
	} from '$store/entities';

	export let data: PageData;

	// $: ({ electric, project } = data)
	let mapComponent
	let tabGroup: SlTabGroup;
	let selectedTab: string = 'map';
	let toggleTaskActionModal = false;

	console.log(data.project.data_extract_url)
	const taskEventStream = getTaskEventStream(data.projectId);
	$: if ($latestEventStore) {
		appendStatesToTaskFeatures(data.project.tasks);
	}
	const entityStatusStream = getEntityStatusStream(data.projectId);
	$: if ($entitiesStatusStore) {
		// TODO replace this with updating the entities geojson
		console.log($entitiesStatusStore)
	}

	$: qrCodeData = generateQrCode(data.project.name, data.project.odk_token, 'REPLACE_ME_WITH_A_USERNAME');

	// *** Selected task *** //
	$: selectedTask.set(data.project.tasks.find((task: ProjectTask) => task.id === $selectedTaskId));
	$: (async () => {
		const task = $selectedTask;
		if (task && task.id) {
			const latestTaskStates = await getLatestStatePerTask();
			const latestTaskDetails = latestTaskStates.get(task.id);
			selectedTaskState.set(latestTaskDetails?.state || 'UNLOCKED_TO_MAP');
		} else {
			selectedTaskState.set('');
		}
	})();
	$: (() => {
		const task = $selectedTask;
		if (task && task.outline) {
		}
	})();

	function zoomToTask(event: CustomEvent<ZoomToTaskEventDetail>) {
		const taskId = event.detail.taskId;
		const taskObj = data.project.tasks.find((task: ProjectTask) => task.id === taskId);

		if (!taskObj) return;

		// Set as selected task for buttons
		selectedTaskId.set(taskObj.id);

		const taskPolygon = polygon(taskObj.outline.coordinates);
		const taskBuffer = buffer(taskPolygon, 5, { units: 'meters' });
		if (taskBuffer && mapComponent.map) {
			const taskBbox: [number, number, number, number] = bbox(taskBuffer) as [number, number, number, number];
			mapComponent.map.fitBounds(taskBbox, { duration: 500 });
		}

		// Open the map tab
		tabGroup.show('map');
	}

	onMount(async () => {
		// In components/map/main.svelte
		// FIXME refactor this to probably use a prop instead...
		await mapComponent.addProjectPolygonToMap(data.project.outline.coordinates);

		// In store/tasks.ts
		await subscribeToTaskEvents(taskEventStream);
		await appendStatesToTaskFeatures(data.project.tasks);
		// In store/entities.ts
		await subscribeToEntityStatusUpdates(entityStatusStream);
	});

	onDestroy(() => {
		taskEventStream.unsubscribeAll();
	});
</script>

<!-- There is a new event to display in the top right corner -->
{#if $latestEventStore}
	<hot-card id="notification-banner" class="absolute z-10 top-18 right-0 font-sans hidden sm:flex">
		{convertDateToTimeAgo($latestEventStore.created_at)}: {$latestEventStore.event} on task {$latestEventStore.task_id} by {$latestEventStore.username}
	</hot-card>
{/if}

<!-- The dialog should overlay with actions for a task -->
{#if $selectedTaskId}
	<TaskActionDialog state={$selectedTaskState} projectId={data.projectId} taskId={$selectedTaskId} />
{/if}

<!-- The main page -->
<div class="h-[calc(100vh-4.625rem)]">
	<MapComponent bind:this={mapComponent} bind:toggleTaskActionModal={toggleTaskActionModal} />

	{#if $selectedTaskId && selectedTab === 'map' && toggleTaskActionModal && ($selectedTaskState === 'UNLOCKED_TO_MAP' || $selectedTaskState === 'LOCKED_FOR_MAPPING')}
		<div class="flex justify-center !w-[100vw] absolute bottom-[4rem] left-0 pointer-events-none z-50">
			<div class="bg-white w-fit font-barlow-regular md:max-w-[580px] pointer-events-auto px-4 pb-3 sm:pb-4 rounded-t-3xl">
				<div class="flex justify-between items-center">
					<p class="text-[#333] text-xl font-barlow-semibold leading-0 pt-2">Task #{$selectedTaskId}</p>
					<hot-icon
						name="close"
						class="!text-[1.5rem] text-[#52525B] cursor-pointer hover:text-red-600 duration-200"
						on:click={() => (toggleTaskActionModal = false)}
					></hot-icon>
				</div>

				{#if $selectedTaskState === 'UNLOCKED_TO_MAP'}
					<p class="my-4 sm:my-6">Do you want to start mapping task #{$selectedTaskId}?</p>
					<div class="flex justify-center gap-x-2">
						<sl-button size="small" variant="default" class="secondary" on:click={() => (toggleTaskActionModal = false)} outline>
							<span class="font-barlow-medium text-sm">CANCEL</span>
						</sl-button>
						<sl-button variant="default" size="small" class="primary" on:click={() => mapTask(data.projectId, $selectedTaskId)}>
							<div class="flex items-center gap-1">
								<hot-icon name="location" class="!text-[1rem] text-white cursor-pointer duration-200"></hot-icon>
								<p class="font-barlow-medium text-sm leading-[0]">START MAPPING</p>
							</div>
						</sl-button>
					</div>
				{:else if $selectedTaskState === 'LOCKED_FOR_MAPPING'}
					<p class="my-4 sm:my-6">Task #{$selectedTaskId} has been locked. Is the task completely mapped?</p>
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
						<sl-button on:click={() => resetTask(data.projectId, $selectedTaskId)} variant="default" outline size="small" class="secondary">
							<div class="flex items-center gap-1">
								<hot-icon name="close" class="!text-[1rem] text-[#d73f37] cursor-pointer duration-200 hover:text-[#b91c1c]"></hot-icon>
								<p class="font-barlow-medium text-sm leading-[0]">CANCEL MAPPING</p>
							</div>
						</sl-button>
						<sl-button on:click={() => finishTask(data.projectId, $selectedTaskId)} variant="default" size="small" class="primary">
							<div class="flex items-center gap-1">
								<hot-icon name="check" class="!text-[1rem] text-white cursor-pointer duration-200"></hot-icon>
								<p class="font-barlow-medium text-sm leading-[0]">COMPLETE MAPPING</p>
							</div>
						</sl-button>
						<sl-button variant="default" size="small" class="gray col-span-2 sm:col-span-1">
							<p class="font-barlow-medium text-sm leading-[0]">GO TO ODK</p>
						</sl-button>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if selectedTab !== 'map'}
		<BottomSheet onClose={() => tabGroup.show('map')}>
			{#if selectedTab === 'events'}
				{#if $taskEventStore.length > 0}
					{#each $taskEventStore as record}
						<EventCard {record} highlight={record.task_id === $selectedTaskId} on:zoomToTask={(e) => zoomToTask(e)} />
					{/each}
				{/if}

				<!-- uncomment More to view stacked component containing comment, instructions, activities -->
				<!-- <More instructions={data?.project?.project_info?.per_task_instructions} /> -->
			{/if}
			{#if selectedTab === 'offline'}
				<span class="font-barlow-medium text-base">Coming soon!</span>
			{/if}
			{#if selectedTab === 'qrcode'}
				<div class="flex flex-col items-center p-4 space-y-4">
					<!-- Text above the QR code -->
					<div class="text-center w-full">
						<div class="font-bold text-lg font-barlow-medium">Scan this QR Code in ODK Collect</div>
					</div>

					<!-- QR Code Container -->
					<div class="flex justify-center w-full max-w-sm">
						<hot-qr-code value={qrCodeData} label="Scan to open ODK Collect" size="250"></hot-qr-code>
					</div>

					<!-- Download Button -->
					<sl-button on:click={downloadQrCode} size="small" class="primary w-full max-w-[200px]">
						<span class="font-barlow-medium text-base">Download QR Code</span>
					</sl-button>

					<!-- Open ODK Button -->
					<sl-button size="small" class="primary w-full max-w-[200px]"
						href="odkcollect://form/{data.project.odk_form_id}{$selectedTaskId ? `?task_filter=${$selectedTaskId}` : ''}"
					>
						<span class="font-barlow-medium text-base">Open ODK</span></sl-button
					>
				</div>
			{/if}
		</BottomSheet>
	{/if}

	<sl-tab-group
		class="z-9999 fixed bottom-0 left-0 right-0"
		placement="bottom"
		no-scroll-controls
		on:sl-tab-show={(e) => {
			selectedTab = e.detail.name;
		}}
		style="--panel-display: none"
		bind:this={tabGroup}
	>
		<sl-tab slot="nav" panel="map">
			<hot-icon name="map" class="!text-[1.7rem] !sm:text-[2rem]"></hot-icon>
		</sl-tab>
		<sl-tab slot="nav" panel="events">
			<hot-icon name="list" class="!text-[1.7rem] !sm:text-[2rem]"></hot-icon>
		</sl-tab>
		<sl-tab slot="nav" panel="offline">
			<hot-icon name="wifi-off" class="!text-[1.7rem] !sm:text-[2rem]"></hot-icon>
		</sl-tab>
		<sl-tab slot="nav" panel="qrcode">
			<hot-icon name="qr-code" class="!text-[1.7rem] !sm:text-[2rem]"></hot-icon>
		</sl-tab>
	</sl-tab-group>
</div>

<!-- </div> -->

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
		z-index: 100; /* Map is using z-index 10 */
	}

	/* The tab selector */
	sl-tab-group::part(nav) {
		display: flex;
		justify-content: center;
		background-color: var(--hot-white);
		height: var(--nav-height);
		background-color: white;
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
