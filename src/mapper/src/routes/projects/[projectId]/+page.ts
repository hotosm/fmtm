import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, fetch }) => {
	const { electric } = await parent();

	const { projectId } = params;
	const project = await fetch(`http://api.fmtm.localhost:7050/projects/${projectId}`);

	if (project.status == 404) {
		console.log('hello');
		error(404, {
			message: `Project with ID (${projectId}) not found`,
		});
	}

	return {
		project: await project.json(),
		projectId: parseInt(projectId),
		electric: electric,
	};
};
