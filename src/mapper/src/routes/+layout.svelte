<script lang="ts">
	import '@hotosm/ui/dist/style.css';
	import '@hotosm/ui/dist/components.js';

	export let data;
</script>

<main class="flex flex-col h-screen overflow-hidden">
	<hot-header></hot-header>
	<slot {data}></slot>
</main>
