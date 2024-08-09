import { v4 as uuidv4 } from 'uuid';
import type { taskactionType } from '$lib/migrations';
import { TaskStatus } from '$lib/types';

export function actionNameFromStatus(statusString: string) {
	const statusKey = Object.keys(TaskStatus).find((key) => key === statusString);
	if (statusKey === undefined) {
		throw new Error(`Invalid status string: ${statusString}`);
	}

	const statusInt = TaskStatus[statusKey];
	let mapAction = 'MAP';

	switch (statusInt) {
		case TaskStatus.READY:
			mapAction = 'MAP'; // Move from READY to LOCKED_FOR_MAPPING
			break;
		case TaskStatus.LOCKED_FOR_MAPPING:
			mapAction = 'FINISH'; // Move from LOCKED_FOR_MAPPING to MAPPED
			break;
		case TaskStatus.MAPPED:
			mapAction = 'UNLOCK'; // Move from MAPPED to READY
			break;
		default:
			throw new Error(`Unknown status integer: ${statusInt}`);
	}

	return mapAction;
}

export function statusEnumLabelToValue(statusString: string, next = false) {
	const statusKey = Object.keys(TaskStatus).find((key) => key === statusString);
	if (statusKey === undefined) {
		throw new Error(`Invalid status string: ${statusString}`);
	}
	let statusInt = TaskStatus[statusKey];

	if (next) {
		if (statusInt === TaskStatus.READY) {
			statusInt = TaskStatus.LOCKED_FOR_MAPPING;
		} else if (statusInt === TaskStatus.LOCKED_FOR_MAPPING) {
			statusInt = TaskStatus.MAPPED;
		} else if (statusInt === TaskStatus.MAPPED) {
			statusInt = TaskStatus.READY;
		}
	}

	return String(statusInt);
}

export function statusEnumValueToLabel(statusIntString: string) {
	const statusInt = parseInt(statusIntString, 10);
	if (isNaN(statusInt)) {
		throw new Error(`Invalid status integer string: ${statusIntString}`);
	}

	const statusEntry = Object.entries(TaskStatus).find(([key, value]) => value === statusInt);
	if (statusEntry !== undefined) {
		return statusEntry[0];
	} else {
		throw new Error(`Invalid status integer: ${statusInt}`);
	}
}

// // interface NewEvent {
// //   project_id: number;
// //   task_id: number;
// //   user_id: number;
// // }

// async function add_history(
// 	db,
// 	projectId: number,
// 	taskId: number,
// 	userId: number,
// 	action: taskactionType,
// 	action_text: string = '',
// ): Promise<void> {
// 	await db.task_history.create({
// 		data: {
// 			event_id: uuidv4(),
// 			project_id: projectId,
// 			task_id: taskId,
// 			action: action,
// 			action_text: action_text,
// 			action_date: new Date().toISOString(),
// 			user_id: userId,
// 		},
// 	});
// }

// async function mapTask(db, projectId: number, taskId: number, userId: number): Promise<void> {
// 	await add_history(db, projectId, taskId, userId, 'LOCKED_FOR_MAPPING');
// }

// async function finishTask(db, projectId: number, taskId: number, userId: number): Promise<void> {
// 	// const query = `
// 	//     WITH last AS (
// 	//         SELECT *
// 	//         FROM task_history
// 	//         WHERE project_id = ? AND task_id = ?
// 	//         ORDER BY aid DESC
// 	//         LIMIT 1
// 	//     ),
// 	//     locked AS (
// 	//         SELECT *
// 	//         FROM last
// 	//         WHERE user_id = ? AND action = 'LOCKED_FOR_MAPPING'
// 	//     )
// 	//     INSERT INTO task_history (
// 	//         event_id, project_id, task_id, action,
// 	//         action_text, action_date, user_id
// 	//     )
// 	//     SELECT
// 	//         ?, -- event_id
// 	//         ?, -- project_id
// 	//         ?, -- task_id
// 	//         'MARKED_MAPPED',
// 	//         'Note: Mapping finished',
// 	//         ?
// 	//         user_id
// 	//     FROM last
// 	//     WHERE user_id = ?
// 	//     RETURNING project_id, task_id, user_id;
// 	// `

// 	// const newEvent: NewEvent = db.rawQuery({
// 	//     sql: query,
// 	//     bindParams: [
// 	//         projectId,
// 	//         taskId,
// 	//         userId,
// 	//         //
// 	//         genUUID(),
// 	//         projectId,
// 	//         taskId,
// 	//         new Date().toISOString(),
// 	//         //
// 	//         userId,
// 	//     ]
// 	// })

// 	// assert(newEvent.project_id === projectId);
// 	// assert(newEvent.task_id === taskId);
// 	// assert(newEvent.user_id === userId);

// 	await add_history(db, projectId, taskId, userId, 'MARKED_MAPPED');
// }

// async function validateTask(db, projectId: number, taskId: number, userId: number): Promise<void> {
// 	await add_history(db, projectId, taskId, userId, 'LOCKED_FOR_VALIDATION');
// }

// async function goodTask(db, projectId: number, taskId: number, userId: number): Promise<void> {
// 	await add_history(db, projectId, taskId, userId, 'VALIDATED');
// }

// async function commentTask(db, projectId: number, taskId: number, userId: number, comment: string): Promise<void> {
// 	await add_history(db, projectId, taskId, userId, 'COMMENT', comment);
// }

// export { mapTask, finishTask, validateTask, goodTask, commentTask };
