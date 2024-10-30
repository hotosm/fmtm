import { writable } from 'svelte/store';
import { ShapeStream, Shape } from '@electric-sql/client';
import type { ShapeData, Row } from '@electric-sql/client';

import type { ProjectTask } from '$lib/types';

const taskFeatcolStore = writable({ type: 'FeatureCollection', features: [] });
const latestEventStore = writable(null);
const taskEventStore = writable([]);

let taskEventShape: Shape;

let selectedTaskId = writable<number | null>(null);
let selectedTask = writable<any>(null);
let selectedTaskState = writable<string>('');

function getTaskEventStream(projectId: number): ShapeStream | undefined {
	if (!projectId) {
		return;
	}
	return new ShapeStream({
		url: 'http://localhost:7055/v1/shape/task_events',
		where: `project_id=${projectId}`,
	});
}

async function subscribeToTaskEvents(taskEventStream: ShapeStream) {
	taskEventShape = new Shape(taskEventStream);

	taskEventShape.subscribe((taskEvent: ShapeData) => {
		let newEvent: Row;
		for (newEvent of taskEvent);
		if (newEvent) {
			latestEventStore.set(newEvent[1]);
		}
	});
}

async function appendStatesToTaskFeatures(projectTasks: ProjectTask[]) {
	const latestTaskStates = await getLatestStatePerTask();
	const features = projectTasks.map((task) => ({
		type: 'Feature',
		geometry: task.outline,
		properties: {
			fid: task.id,
			...latestTaskStates.get(task.id),
		} || {
			fid: task.id,
			state: 'UNLOCKED_TO_MAP',
			actioned_by_uid: null,
		},
	}));

	taskFeatcolStore.set({ type: 'FeatureCollection', features });
}

async function getLatestStatePerTask() {
	const taskEventData: ShapeData = await taskEventShape.value;
	const taskEventRows = Array.from(taskEventData.values());

	// Update the taskEventStore writable store
	taskEventStore.set(taskEventRows);

	const currentTaskStates = new Map();

	for (const taskData of taskEventRows) {
		// Use the task_id as the key and state as the value
		currentTaskStates.set(taskData.task_id, {
			state: taskData.state || 'UNLOCKED_TO_MAP',
			actioned_by_uid: taskData.user_id || null,
		});
	}

	return currentTaskStates;
}

export {
	taskFeatcolStore,
	latestEventStore,
	taskEventStore,
	selectedTaskId,
	selectedTask,
	selectedTaskState,
	getTaskEventStream,
	subscribeToTaskEvents,
	appendStatesToTaskFeatures,
	getLatestStatePerTask,
};
