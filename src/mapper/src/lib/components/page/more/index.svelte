<script lang="ts">
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
</script>

<div class="font-barlow-medium">
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
		<div class="flex items-center gap-x-2">
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
		<div>
			<p>Comment</p>
		</div>
	{/if}
	{#if activeStack === 'Instructions'}
		<div>
			<p>Instructions</p>
		</div>
	{/if}
	{#if activeStack === 'Activities'}
		<div>
			<p>Activities</p>
		</div>
	{/if}
</div>

<style></style>
