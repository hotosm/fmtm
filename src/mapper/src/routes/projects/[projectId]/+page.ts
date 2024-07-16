import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { projectId } = params;
	const project = await fetch(`http://api.fmtm.localhost:7050/projects/${projectId}`);

	if (project.status == 404) {
		console.log('hello');
		error(404, {
			message: `Project with ID (${projectId}) not found`,
		});
	}

	return project.json();
};
