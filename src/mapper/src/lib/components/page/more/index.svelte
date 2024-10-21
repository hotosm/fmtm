<script lang="ts">
	import Editor from '$lib/components/common/Editor/editor.svelte';

	type stackType = '' | 'Comment' | 'Instructions' | 'Activities';
	const stackGroup: { icon: string; title: stackType }[] = [
		{
			icon: 'chat',
			title: 'Comment',
		},
		{
			icon: 'description',
			title: 'Instructions',
		},
		{
			icon: 'list-ul',
			title: 'Activities',
		},
	];

	let activeStack: stackType = 'Comment';
	export let instructions;
</script>

<div class="font-barlow-medium h-full">
	{#if activeStack === ''}
		{#each stackGroup as stack}
			<div
				class="group flex items-center justify-between hover:bg-red-50 rounded-md px-2 duration-200 cursor-pointer"
				on:click={() => (activeStack = stack.title)}
			>
				<div class="flex items-center gap-3">
					<hot-icon name={stack.icon} class="text-[1.25rem]"></hot-icon>
					<p>{stack.title}</p>
				</div>
				<hot-icon name="chevron-right" class="text-[1rem] group-hover:translate-x-1 duration-200"></hot-icon>
			</div>
		{/each}
	{/if}

	<!-- header -->
	{#if activeStack !== ''}
		<div class="flex items-center gap-x-2 sticky top-0 bg-white">
			<hot-icon
				name="chevron-left"
				class="text-[1rem] hover:-translate-x-[2px] duration-200 cursor-pointer text-[1.125rem] text-black hover:text-red-600 duration-200"
				on:click={() => (activeStack = '')}
			></hot-icon>
			<p class="text-[1.125rem] font-barlow-semibold leading-0">{activeStack}</p>
		</div>
	{/if}
	<!-- body -->
	{#if activeStack === 'Comment'}
		<div class="h-[calc(100%-2.25rem)] sm:h-[calc(100%-2.6rem)]">
			<div class="h-[calc(100%-11.875rem)] overflow-y-scroll"></div>

			<div class="">
				<Editor
					editable={true}
					content=""
					setEditorHtmlContent={(editorText) => {
						// to-do: store state to post comment
					}}
				/>
				<div class="w-full flex justify-end my-2 gap-2">
					<sl-button variant="default" size="small" class="secondary col-span-2 sm:col-span-1"
						><span class="font-barlow-medium text-sm">CLEAR</span></sl-button
					>
					<sl-button variant="default" size="small" class="primary col-span-2 sm:col-span-1"
						><span class="font-barlow-medium text-sm">COMMENT</span></sl-button
					>
				</div>
			</div>
		</div>
	{/if}
	{#if activeStack === 'Instructions'}
		<div>
			<Editor editable={false} content={instructions} />
		</div>
	{/if}
	{#if activeStack === 'Activities'}
		<div>
			<p>Activities</p>
		</div>
	{/if}
</div>

<style></style>
