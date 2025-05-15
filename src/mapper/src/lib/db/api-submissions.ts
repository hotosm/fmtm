import type { PGlite } from '@electric-sql/pglite';
import type { DbApiSubmissionType } from '$lib/types.ts';

async function count(db: PGlite): Promise<number> {
	if (!db) return 0;

	const dbData = await db.query(`SELECT COUNT(*) as count FROM api_submissions WHERE status = 'PENDING'`);
	const countStr = dbData.rows.at(-1)?.count;
	return countStr ? Number(countStr) : 0;
}

async function next(db: PGlite): Promise<DbApiSubmissionType | undefined> {
	if (!db) return;

	const dbData = await db.query(`SELECT * FROM api_submissions WHERE status = 'PENDING' ORDER BY queued_at LIMIT 1;`);
	return dbData.rows.at(-1) as DbApiSubmissionType | undefined;
}

async function success(db: PGlite, id: number, success: boolean): Promise<void> {
	if (!db) return;

	await db.query(
		`UPDATE api_submissions
		 SET
			status = $1,
			last_attempt_at = now(),
			success_at = CASE WHEN $1 = 'RECEIVED' THEN now() ELSE NULL END,
			error = NULL
		 WHERE id = $2`,
		[success ? 'RECEIVED' : 'PENDING', id],
	);
}

async function failure(db: PGlite, id: number, error: string): Promise<void> {
	if (!db) return;

	await db.query(
		`UPDATE api_submissions
		 SET
			error = $1,
			last_attempt_at = now(),
			retry_count = retry_count + 1
		 WHERE id = $2`,
		[error, id],
	);
}

export const DbApiSubmission = {
	count,
	next,
	success,
	failure,
};
