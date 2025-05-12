import { PGlite } from '@electric-sql/pglite';
import type { projectType, DbProject } from '$lib/types';
import { DB_PROJECT_COLUMNS } from '$lib/types';

export async function fetchProjectFromLocalDB(db: PGlite, projectId: string): Promise<projectType | undefined> {
	if (!db) return;

	const response = await db.query(`SELECT * FROM projects WHERE id = $1;`, [projectId]);
	const localProject = response.rows.at(-1) ?? null;
	return localProject;
}

export async function updateLocalDbProjectData(db: PGlite, projectData: Partial<DbProject>): Promise<void> {
	if (!db || !projectData || !projectData.id) return;

	// Filter keys to only include those present in the actual DB schema (excluding 'id')
	const columns = Object.keys(projectData).filter((key) => key !== 'id' && DB_PROJECT_COLUMNS.has(key));
	const values = columns.map((key) => projectData[key as keyof DbProject]);

	// Add the ID for the WHERE clause
	values.push(projectData.id);

	const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
	const sql = `
		UPDATE projects
		SET ${setClause}
		WHERE id = $${columns.length + 1};
	`;

	await db.query(sql, values);
}
