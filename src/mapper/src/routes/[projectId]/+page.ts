import { error } from '@sveltejs/kit';
import type { PageLoad } from '../$types';

const API_URL = import.meta.env.VITE_API_URL;

export const load: PageLoad = async ({ parent, params, fetch }) => {
	// const { db } = await parent();

	const { projectId } = params;
	const project = await fetch(`${API_URL}/projects/${projectId}`);

	if (project.status == 404) {
		error(404, {
			message: `Project with ID (${projectId}) not found`,
		});
	}

	return {
		project: await project.json(),
		projectId: parseInt(projectId),
		// db: db,
	};
};
