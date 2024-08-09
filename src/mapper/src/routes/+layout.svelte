<script lang="ts">
	import '@hotosm/ui/dist/style.css';
	import '@hotosm/ui/dist/components.js';
	import { setBasePath } from '@hotosm/ui/dist/components';

	setBasePath('/mapnow');

	export let data;
</script>

<main class="flex flex-col h-screen overflow-hidden">
	<hot-header></hot-header>
	<slot {data}></slot>
</main>
