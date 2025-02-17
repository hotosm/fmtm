<script lang="ts">
	import '@hotosm/ui/dist/style.css';
	import '@hotosm/ui/dist/hotosm-ui';
	import { setBasePath } from '@hotosm/ui/dist/hotosm-ui';
	import { page } from '$app/stores';
	import Toast from '$lib/components/toast.svelte';
	import Header from '$lib/components/header.svelte';
	setBasePath('/mapnow');

	let { data, children } = $props();
	console.log("window.location.href:", window.location.href);
</script>


{#if window.location.href.includes('/webforms')}
	{@render children?.({ data })}
{:else}
	<main class="flex flex-col h-screen overflow-hidden">
		<Header />
		<Toast />
		{@render children?.({ data })}
	</main>
{/if}
