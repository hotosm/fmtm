export const prerender = false;
export const ssr = false;

import 'virtual:uno.css';
// import { initDb } from '$lib/db/pglite';

export function load() {
	return {
		// db: initDb(),
	};
}
