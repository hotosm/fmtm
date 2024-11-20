<script lang="ts">
	import HotLogo from '$assets/images/hot-logo.svg';
	import HotLogoText from '$assets/images/hot-logo-text.svg';
	import Login from '$lib/components/login.svelte';
	import { getLoginStore } from '$store/login.svelte.ts';

	const loginStore = getLoginStore();
</script>

<div class="p-3 flex items-center justify-between">
	<div class="flex items-center gap-1">
		<img src={HotLogo} alt="hot-logo" />
		<img src={HotLogoText} alt="hot-logo" />
	</div>
	<div class="flex items-center gap-4">
		<sl-button
			class="hover:bg-gray-50 rounded"
			variant="text"
			size="small"
			onclick={() => {
				loginStore.toggleLoginModal(true);
			}}
			onkeydown={(e: KeyboardEvent) => {
				if (e.key === 'Enter') {
					loginStore.toggleLoginModal(true);
				}
			}}
			role="button"
			tabindex="0"
		>
			<span class="font-barlow-medium text-base">SIGN IN</span>
		</sl-button>
		<hot-icon
			name="list"
			class="!text-[1.8rem] text-[#52525B] leading-0 cursor-pointer hover:text-red-600 duration-200"
			onclick={() => {}}
			onkeydown={() => {}}
			role="button"
			tabindex="0"
		></hot-icon>
	</div>
</div>
<Login />
