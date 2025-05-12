import 'virtual:uno.css';
import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

import { getDbOnce } from '$lib/db/pglite';
import { getLoginStore } from '$store/login.svelte.ts';
import { refreshCookies, getUserDetailsFromApi } from '$lib/api/login';

// NOTE we can't prerender as we are using dynamic routing [projectId]
export const prerender = false;
export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
	let config;
	const loginStore = getLoginStore();
	const dbPromise = getDbOnce(); // Don't await here to allow loading spinner in layout.svelte

	try {
		/*
			Login + user details
		*/
		let apiUser = await refreshCookies(fetch);
		loginStore.setRefreshCookieResponse(apiUser);
		if (apiUser?.username !== 'svcfmtm') {
			// Call /auth/me to populate the user details in the header
			apiUser = await getUserDetailsFromApi(fetch);
			if (!apiUser) {
				loginStore.signOut();
				throw error(401, { message: `You must log in first` });
			} else {
				loginStore.setAuthDetails(apiUser);
			}
		}
	} catch (error) {}

	try {
		const s3Response = await fetch(`${import.meta.env.VITE_S3_URL}/fmtm-data/frontend/config.json`);
		if (s3Response.ok) {
			config = await s3Response.json();
		} else {
			throw new Error('S3 config fetch failed');
		}
	} catch (error) {
		console.warn('Falling back to local config:', error);
		const localResponse = await fetch('/config.json');
		config = await localResponse.json();
	}

	return {
		dbPromise,
		config,
	};
};
