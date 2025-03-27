<script lang="ts">
	import type { projectType } from '$lib/types';
	import OsmLogo from '$assets/images/osm-logo.png';
	import { goto } from '$app/navigation';

	type propType = {
		project: projectType;
	};

	const { project }: propType = $props();
</script>

<div
	onclick={() => goto(`/${project.id}`)}
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'Enter') goto(`/${project.id}`);
	}}
	role="button"
	tabindex="0"
	class={`hover:bg-[#FFEDED] hover:shadow-xl duration-500 rounded-lg bg-white p-4 cursor-pointer`}
>
	<div class="flex flex-col justify-between h-full">
		<div>
			{#if !project.organisation_logo}
				<img src={project.organisation_logo} class="h-7 max-h-7" alt="organization logo" />
			{:else}
				<img src={OsmLogo} class="h-7 max-h-7" alt="default organization logo" />
			{/if}
			<div class="my-3">
				<p class="text-[0.75rem] leading-[0.9rem] font-semibold text-[#706E6E] mb-1">
					ID: #{project.id}
				</p>
				<p
					class="capitalize text-[0.75rem] leading-normal font-normal line-clamp-1 text-[#7A7676]"
					title={project?.location_str}
				>
					{project?.location_str || '-'}
				</p>
			</div>

			<div>
				<p
					class="text-[0.875rem] leading-normal font-semibold text-[#090909] line-clamp-1 capitalize mb-1"
					title={project.name}
				>
					{project.name}
				</p>
				<p
					class="text-[0.875rem] leading-normal font-normal capitalize line-clamp-3 text-[#2B2B2B] min-h-[3.2rem]"
					title={project.short_description}
				>
					{project.short_description}
				</p>
			</div>
		</div>
		<div class="mt-4">
			<div class="flex justify-between mb-1">
				<p class="text-[0.75rem] leading-[0.9rem] font-semibold">{project.total_tasks} Tasks</p>
				<p class="text-[0.75rem] leading-[0.9rem] font-semibold">30 Submissions</p>
			</div>
			<sl-tooltip>
				<div slot="content">
					<p>{12} Total Tasks</p>
					<p>{5} Tasks Mapped</p>
					<p>{3} Tasks Validated</p>
				</div>

				<div class="h-[0.375rem] w-full bg-[#D7D7D7] rounded-xl overflow-hidden flex cursor-pointer">
					<div style={`width: ${(5 / 12) * 100}%;`} class="h-full bg-[#484848] rounded-r-xl"></div>
					<div style={`width: ${(3 / 12) * 100}%;`} class="h-full bg-[#989898] rounded-r-xl"></div>
				</div>
			</sl-tooltip>
		</div>
	</div>
</div>
