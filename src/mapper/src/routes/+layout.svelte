<script lang="ts">
	import '@hotosm/ui/dist/style.css';
	import '@hotosm/ui/dist/hotosm-ui';
	import { setBasePath } from '@hotosm/ui/dist/hotosm-ui';
	import Toast from '$lib/components/toast.svelte';

	setBasePath('/mapnow');

	let { data, children } = $props();

	document.addEventListener(
		'touchstart',
		(e) => {
			if (window.scrollY === 0) {
				e.preventDefault(); // Prevents mobile browsers from pull-to-refresh
			}
		},
		{ passive: false },
	);
</script>

<main class="flex flex-col h-screen overflow-hidden">
	<hot-header></hot-header>
	<Toast />
	{@render children?.({ data })}
</main>
