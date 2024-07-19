import { genUUID } from 'electric-sql/util';
import type { taskactionType } from '$lib/migrations';

// interface NewEvent {
//   project_id: number;
//   task_id: number;
//   user_id: number;
// }

async function add_history(
	db,
	projectId: number,
	taskId: number,
	userId: number,
	action: taskactionType,
	action_text: string = '',
): Promise<void> {
	await db.task_history.create({
		data: {
			event_id: genUUID(),
			project_id: projectId,
			task_id: taskId,
			action: action,
			action_text: action_text,
			action_date: new Date().toISOString(),
			user_id: userId,
		},
	});
}

async function mapTask(db, projectId: number, taskId: number, userId: number): Promise<void> {
	await add_history(db, projectId, taskId, userId, 'LOCKED_FOR_MAPPING');
}

async function finishTask(db, projectId: number, taskId: number, userId: number): Promise<void> {
	// const query = `
	//     WITH last AS (
	//         SELECT *
	//         FROM task_history
	//         WHERE project_id = ? AND task_id = ?
	//         ORDER BY aid DESC
	//         LIMIT 1
	//     ),
	//     locked AS (
	//         SELECT *
	//         FROM last
	//         WHERE user_id = ? AND action = 'LOCKED_FOR_MAPPING'
	//     )
	//     INSERT INTO task_history (
	//         event_id, project_id, task_id, action,
	//         action_text, action_date, user_id
	//     )
	//     SELECT
	//         ?, -- event_id
	//         ?, -- project_id
	//         ?, -- task_id
	//         'MARKED_MAPPED',
	//         'Note: Mapping finished',
	//         ?
	//         user_id
	//     FROM last
	//     WHERE user_id = ?
	//     RETURNING project_id, task_id, user_id;
	// `

	// const newEvent: NewEvent = db.rawQuery({
	//     sql: query,
	//     bindParams: [
	//         projectId,
	//         taskId,
	//         userId,
	//         //
	//         genUUID(),
	//         projectId,
	//         taskId,
	//         new Date().toISOString(),
	//         //
	//         userId,
	//     ]
	// })

	// assert(newEvent.project_id === projectId);
	// assert(newEvent.task_id === taskId);
	// assert(newEvent.user_id === userId);

	await add_history(db, projectId, taskId, userId, 'MARKED_MAPPED');
}

async function validateTask(db, projectId: number, taskId: number, userId: number): Promise<void> {
	await add_history(db, projectId, taskId, userId, 'LOCKED_FOR_VALIDATION');
}

async function goodTask(db, projectId: number, taskId: number, userId: number): Promise<void> {
	await add_history(db, projectId, taskId, userId, 'VALIDATED');
}

async function commentTask(db, projectId: number, taskId: number, userId: number, comment: string): Promise<void> {
	await add_history(db, projectId, taskId, userId, 'COMMENT', comment);
}

export { mapTask, finishTask, validateTask, goodTask, commentTask };
