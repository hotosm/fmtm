<script lang="ts">
	import '$styles/page.css';
	import '@hotosm/ui/dist/hotosm-ui';

	import { onMount } from 'svelte';
	import { online } from 'svelte/reactivity/window';
	import type { PageProps } from './$types';
	import { pwaInfo } from 'virtual:pwa-info';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

	import { getCommonStore, getAlertStore } from '$store/common.svelte.ts';
	import Toast from '$lib/components/toast.svelte';
	import Header from '$lib/components/header.svelte';
	import OfflineBanner from '$lib/components/offline/offline-banner.svelte';
	import { m } from '$translations/messages.js';

	let { data, children }: PageProps = $props();

	const commonStore = getCommonStore();
	const alertStore = getAlertStore();
	commonStore.setConfig(data.config);
	let dbPromise = data.dbPromise;

	// Required for PWA to work with svelte
	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
    const { offlineReady, needRefresh, updateServiceWorker, offline }: RegisterSWOptions = useRegisterSW({
        onRegistered(swr: any) {
            console.log(`SW registered: ${swr}`);
        },
        onRegisterError(error: any) {
            console.log('SW registration error', error);
        },
        onOfflineReady() {
            console.log('SW ready for offline')
			alertStore.setAlert({ message: m['offline.ready_offline'](), variant: 'default', duration: 2000 });
        },
    });

	onMount(async () => {
		// Dynamically inject CSS specified in config
		if (data.config?.cssFile) {
			const linkElement = document.createElement('link');
			linkElement.rel = 'stylesheet';
			linkElement.href = data.config.cssFile;
			document.head.appendChild(linkElement);
		}
	});
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<main class="flex flex-col h-screen overflow-hidden font-barlow">
	{#if !online.current}
		<OfflineBanner></OfflineBanner>
	{/if}
	<Header></Header>
	<Toast></Toast>

	{#await dbPromise}
		<div class="spinner-wrapper">
			<sl-spinner class="loading-spinner"></sl-spinner>
		</div>
	{:then db}
		{@render children?.({ data, db })}
	{:catch error}
		<p class="text-red-500 p-4">Error loading PGLite: {error.message}</p>
	{/await}
</main>
