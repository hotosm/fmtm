<script lang="ts">
	import { onMount } from 'svelte';
	import HotLogo from '$assets/images/hot-logo.svg';
	import HotLogoText from '$assets/images/hot-logo-text.svg';
	import Login from '$lib/components/login.svelte';
	import { getLoginStore } from '$store/login.svelte.ts';

	const loginStore = getLoginStore();

	onMount(() => {
		// retrieve persisted auth details from local storage and set  auth details to store
		const persistedAuth = localStorage.getItem('persist:login');
		if (!persistedAuth) return;
		loginStore.setAuthDetails(JSON.parse(JSON.parse(persistedAuth).authDetails));
	});
</script>

<div class="p-3 flex items-center justify-between">
	<div class="flex items-center gap-1">
		<img src={HotLogo} alt="hot-logo" />
		<img src={HotLogoText} alt="hot-logo" />
	</div>
	<div class="flex items-center gap-4">
		{#if loginStore?.getAuthDetails}
			<div class="flex items-center gap-2">
				{#if !loginStore?.getAuthDetails?.profile_img}
					<hot-icon
						name="person-fill"
						class="!text-[1.5rem] text-[#52525B] leading-0 cursor-pointer text-red-600 duration-200"
						onclick={() => {}}
						onkeydown={() => {}}
						role="button"
						tabindex="0"
					></hot-icon>
				{:else}
					<img
						src={loginStore?.getAuthDetails?.profile_img}
						alt="profile"
						class="w-[1.8rem] h-[1.8rem] min-w-[1.8rem] min-h-[1.8rem] max-w-[1.8rem] max-h-[1.8rem] rounded-full"
					/>
				{/if}
				<p class="font-barlow-medium">{loginStore?.getAuthDetails?.username}</p>
			</div>
		{:else}
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
		{/if}
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
