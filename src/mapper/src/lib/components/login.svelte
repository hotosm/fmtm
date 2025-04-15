<script lang="ts">
	import '$styles/login.css';
	import OSMLogo from '$assets/images/osm-logo.png';
	import GoogleLogo from '$assets/images/google-logo.svg';
	import { loginRedirect } from '$lib/utils/login';
	import { getLoginStore } from '$store/login.svelte.ts';

	type loginOptionsType = {
		id: 'osm_account' | 'google_account';
		name: string;
		image: string;
		description?: string;
	};

	const loginOptions: loginOptionsType[] = [
		{
			id: 'osm_account',
			name: 'Sign in with OSM',
			image: OSMLogo,
			description: 'Edits made in FMTM will be credited to your OSM account.',
		},
		{
			id: 'google_account',
			name: 'Sign in with Google',
			image: GoogleLogo,
		},
	];

	let dialogRef;
	const loginStore = getLoginStore();

	const handleSignIn = async (selectedOption: 'osm_account' | 'google_account') => {
		loginRedirect(selectedOption);
	};
</script>

<hot-dialog
	bind:this={dialogRef}
	class="login-dialog"
	open={loginStore.isLoginModalOpen}
	onsl-hide={() => {
		loginStore.toggleLoginModal(false);
	}}
	noHeader
>
	<div class="content">
		<div class="header">
			<p class="title">Sign In</p>
			<hot-icon
				name="close"
				onclick={() => loginStore.toggleLoginModal(false)}
				role="button"
				tabindex="0"
				onkeydown={(e: KeyboardEvent) => {
					if (e.key === 'Enter') loginStore.toggleLoginModal(false);
				}}
			></hot-icon>
		</div>
		<div class="subtitle">Select an account type to sign in</div>
		<div class="options">
			{#each loginOptions as option}
				<div
					id={option.id}
					onclick={() => handleSignIn(option.id)}
					role="button"
					onkeydown={(e: KeyboardEvent) => {
						if (e.key === 'Enter') {
							handleSignIn(option.id);
						}
					}}
					tabindex="0"
					class="option"
				>
					<img src={option?.image} class="image" alt="personal osm account" />

					<div class="name-desc">
						<div class="option-name">{option.name}</div>
						{#if option.description}
							<div>{option.description}</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</hot-dialog>
