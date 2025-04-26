import type { PGliteWithSync } from '@electric-sql/pglite-sync';
import type { ShapeStream, ShapeData, Row } from '@electric-sql/client';
import type { Feature, FeatureCollection, GeoJSON } from 'geojson';

import type { ProjectTask, TaskEventType } from '$lib/types';
import { getLoginStore } from '$store/login.svelte.ts';
import { getTimeDiff } from '$lib/utils/datetime';

const loginStore = getLoginStore();

let featcol: FeatureCollection = $state({ type: 'FeatureCollection', features: [] });
let latestEvent: TaskEventType | null = $state(null);
let events: TaskEventType[] = $state([]);

// for UI show task index for simplicity & for api's use task id
let selectedTaskId: number | null = $state(null);
let selectedTaskIndex: number | null = $state(null);

let selectedTask: any = $state(null);
let selectedTaskState: string = $state('');
let selectedTaskGeom: GeoJSON | null = $state(null);
let taskIdIndexMap: Record<number, number> = $state({});
let commentMention: TaskEventType | null = $state(null);

let userDetails = $derived(loginStore.getAuthDetails);

async function getTaskEventStream(db: PGliteWithSync, projectId: number): Promise<ShapeStream | undefined> {
	if (!db || !projectId) {
		return;
	}

	const taskEventSync = await db.electric.syncShapeToTable({
		shape: {
			url: `${import.meta.env.VITE_SYNC_URL}/v1/shape`,
			params: {
				table: 'task_events',
				where: `project_id=${projectId}`,
			},
		},
		table: 'task_events',
		primaryKey: ['event_id'],
		shapeKey: 'task_events',
		initialInsertMethod: 'csv', // performance boost on initial sync
	});

	taskEventSync.stream.subscribe(
		(taskEvent: ShapeData) => {
			// Filter only rows that have a .value (actual data changes)
			const rows: Row[] = taskEvent.filter((item) => 'value' in item && item.value).map((item) => item.value as Row);

			if (rows.length) {
				latestEvent = rows.at(-1);

				if (
					latestEvent?.event === 'COMMENT' &&
					latestEvent?.comment?.includes(`@${userDetails?.username}`) &&
					latestEvent.comment?.startsWith('#submissionId:uuid:') &&
					getTimeDiff(new Date(latestEvent.created_at)) < 120
				) {
					commentMention = latestEvent;
				}

				for (const newEvent of rows) {
					if (newEvent.task_id === selectedTaskId) {
						selectedTaskState = newEvent.state;
					}
				}
			}
		},
		(error) => {
			console.error('taskEvent sync error', error);
		},
	);

	return taskEventSync;
}

function getTaskStore() {
	async function appendTaskStatesToFeatcol(db: PGliteWithSync, projectId: number, projectTasks: ProjectTask[]) {
		const latestTaskStates = await getLatestStatePerTask(db, projectId);
		const features: Feature[] = projectTasks.map((task) => ({
			type: 'Feature',
			geometry: task.outline,
			properties: {
				fid: task.id,
				state: latestTaskStates.get(task.id)?.state || 'UNLOCKED_TO_MAP',
				actioned_by_uid: latestTaskStates.get(task.id)?.actioned_by_uid,
				task_index: task?.project_task_index,
			},
		}));

		featcol = { type: 'FeatureCollection', features };
	}

	async function getLatestStatePerTask(db: PGliteWithSync, projectId: number) {
		const taskEvents = await db.query('SELECT * FROM task_events WHERE project_id = $1', [projectId]);
		const taskEventRows = Array.from(taskEvents.rows.values()) as TaskEventType[];
		// Update the events in taskStore
		events = taskEventRows;

		const currentTaskStates = new Map();

		for (const taskData of taskEventRows) {
			// Use the task_id as the key and state as the value
			currentTaskStates.set(taskData.task_id, {
				state: taskData.state,
				actioned_by_uid: taskData.user_id,
			});
		}

		return currentTaskStates;
	}

	async function setSelectedTaskId(db: PGliteWithSync, taskId: number | null, taskIndex: number | null) {
		selectedTaskId = taskId;
		selectedTaskIndex = taskIndex;

		const tasks = await db.query('SELECT * FROM task_events WHERE task_id = $1', [taskId]);
		const taskRows = Array.from(tasks.rows.values()) as TaskEventType[];
		if (!taskRows) return;

		selectedTask = taskRows[0];
		selectedTaskState = selectedTask?.state || 'UNLOCKED_TO_MAP';
		selectedTaskGeom = featcol.features.find((x) => x?.properties?.fid === taskId)?.geometry || null;
	}

	function setTaskIdIndexMap(idIndexMappedRecord: Record<number, number>) {
		taskIdIndexMap = idIndexMappedRecord;
	}

	function dismissCommentMention() {
		commentMention = null;
	}

	function clearTaskStates() {
		selectedTask = null;
		selectedTaskId = null;
		selectedTaskIndex = null;
		selectedTaskGeom = null;
		selectedTaskState = '';
		taskIdIndexMap = {};
		featcol = { type: 'FeatureCollection', features: [] };
	}
	return {
		// The task areas / status colours displayed on the map
		appendTaskStatesToFeatcol: appendTaskStatesToFeatcol,
		setSelectedTaskId: setSelectedTaskId,
		setTaskIdIndexMap: setTaskIdIndexMap,
		dismissCommentMention: dismissCommentMention,
		clearTaskStates: clearTaskStates,
		get featcol() {
			return featcol;
		},
		// The latest event to display in notifications bar
		get latestEvent() {
			return latestEvent;
		},
		get events() {
			return events;
		},

		// The selected task to display mapping dialog
		get selectedTaskId() {
			return selectedTaskId;
		},
		get selectedTaskIndex() {
			return selectedTaskIndex;
		},
		get selectedTask() {
			return selectedTask;
		},
		get selectedTaskState() {
			return selectedTaskState;
		},
		get selectedTaskGeom() {
			return selectedTaskGeom;
		},
		get taskIdIndexMap() {
			return taskIdIndexMap;
		},
		get commentMention() {
			return commentMention;
		},
	};
}

export { getTaskStore, getTaskEventStream };
