<script lang="ts">
	import { writeOfflineExtract } from '$lib/map/extracts';
	import { m } from '$translations/messages.js';

	interface Props {
		projectId: number;
		extract_url: string;
	}
	let { projectId, extract_url }: Props = $props();
</script>

<div class="extract">
	<hot-button
		onclick={() => writeOfflineExtract(projectId, extract_url)}
		onkeydown={(e: KeyboardEvent) => {
			e.key === 'Enter' && writeOfflineExtract(projectId, extract_url);
		}}
		role="button"
		tabindex="0"
		size="small"
		class="button"
	>
		<hot-icon slot="prefix" name="download" class="icon"></hot-icon>
		<span>{m['offline.store_features_offline']()}</span>
	</hot-button>
</div>
