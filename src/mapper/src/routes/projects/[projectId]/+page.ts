import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, fetch }) => {
	const { electric } = await parent();

	const { projectId } = params;

	const test = await fetch('https://sandbox.hotosm.dev/api/0.6/changesets');
	console.log(test);

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
