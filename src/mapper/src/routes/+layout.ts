export const prerender = false;
export const ssr = false;

import { initElectric } from '$lib/init-electric'

export async function load() {
	return {
		electric: await initElectric()
	};
}
