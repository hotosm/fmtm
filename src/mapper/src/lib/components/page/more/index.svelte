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

	let activeStack: stackType = '';
	export let instructions;
</script>

<div class="font-barlow-medium h-full">
	{#if activeStack === ''}
		{#each stackGroup as stack}
			<div
				class="group flex items-center justify-between hover:bg-red-50 rounded-md p-2 duration-200 cursor-pointer"
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
		<div class="flex items-center gap-x-2 sticky top-0 bg-white pb-2 z-50">
			<hot-icon
				name="chevron-left"
				class="text-[1rem] hover:-translate-x-[2px] duration-200 cursor-pointer text-[1.125rem] text-black hover:text-red-600 duration-200"
				on:click={() => (activeStack = '')}
			></hot-icon>
			<p class="text-[1.125rem] font-barlow-semibold">{activeStack}</p>
		</div>
	{/if}
	<!-- body -->
	{#if activeStack === 'Comment'}
		<div class="h-[calc(100%-2.25rem)] sm:h-[calc(100%-2.6rem)]">
			<div class="h-[calc(100%-11.875rem)] overflow-y-scroll overflow-x-hidden flex flex-col gap-2">
				{#each Array.from({ length: 5 }) as _, index}
					<div class="flex flex-col gap-2 py-3 bg-[#F6F5F5] rounded-md">
						<div class="flex gap-4 px-3">
							<hot-icon
								name="person-fill"
								style="border: 1px solid"
								class="!text-[1.7rem] text-red-600 cursor-pointer duration-200 rounded-full p-[2px] bg-white"
							></hot-icon>
							<div class="flex flex-col gap-1 flex-1">
								<p class="font-semibold">Localadmin</p>
								<div class="flex items-center justify-between">
									<p class="text-[#484848] text-sm">#2</p>
									<div class="flex items-center gap-2">
										<hot-icon name="clock-history" class="!text-[1rem] text-red-600 cursor-pointer duration-200"
										></hot-icon>
										<p class="text-[#484848] text-sm">2024-10-21 11:42</p>
									</div>
								</div>
							</div>
						</div>
						<Editor editable={false} content={'<p>This is a comment</p>'} />
					</div>
				{/each}
			</div>

			<div class="mt-2">
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
		<div class="overflow-y-scroll overflow-x-hidden flex flex-col gap-2 pb-2">
			{#each Array.from({ length: 15 }) as _, index}
				<div class="flex flex-col gap-2 py-3 bg-[#F6F5F5] rounded-md mr-1">
					<div class="flex gap-4 px-3">
						<hot-icon
							name="person-fill"
							style="border: 1px solid"
							class="!text-[1.7rem] text-red-600 cursor-pointer duration-200 rounded-full p-[2px] bg-white"
						></hot-icon>
						<div class="flex flex-col gap-1 flex-1">
							<p class="font-semibold">Localadmin</p>
							<div class="flex items-center justify-between">
								<p class="text-[#484848] text-sm">#2</p>
								<div class="flex items-center gap-2">
									<hot-icon name="clock-history" class="!text-[1rem] text-red-600 cursor-pointer duration-200"
									></hot-icon>
									<p class="text-[#484848] text-sm">2024-10-21 11:42</p>
								</div>
							</div>
						</div>
					</div>
					<div class="px-3 flex items-center fmtm-justify-between gap-2">
						<p class="font-normal text-[#484848] flex-1">
							<span class="">svcfmtm</span> updated status to <span>MAPPED</span>
						</p>
						<hot-icon name="map" class="!text-[1rem] text-[#484848] hover:text-red-600 cursor-pointer duration-200"
						></hot-icon>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style></style>
