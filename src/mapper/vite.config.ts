import path from 'path';
import { defineConfig } from 'vitest/config';
import type { VitePWAOptions } from 'vite-plugin-pwa';
import type { RouteMatchCallbackOptions } from 'workbox-core';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import UnoCSS from 'unocss/vite';
import extractorSvelte from '@unocss/extractor-svelte';

const pwaOptions: Partial<VitePWAOptions> = {
	// This will prompt the user to update and refresh instead of seamlessly in the background
	// changing this behaviour from autoUpdate back to prompt is quite difficult to do!
	registerType: 'prompt',
	injectRegister: 'auto',
	// Allow testing the PWA during local development
	devOptions: {
		enabled: true,
		// We need this to include /project/ID as well as home page for direct load when offline
		navigateFallbackAllowlist: [/^\/$/, /^\/\d+$/, /^\/project\/.+$/],
	},
	// // Cache all the imports, including favicon
	workbox: {
		// Don't fallback on document based (e.g. `/some-page`) requests
		// Even though this says `null` by default, I had to set this specifically to `null` to make it work
		navigateFallback: null,
		globPatterns: ['**/*.{js,css,html,wasm,ico,svg,png,jpg,jpeg,gif,webmanifest}'],
		// This is where the magic happens: routes to cache key to cache to
		runtimeCaching: [
			{
				urlPattern: ({ url }: RouteMatchCallbackOptions) => url.origin === self.location.origin,
				handler: 'CacheFirst',
				options: {
					cacheName: 'field-tm-static-assets',
					expiration: {
						maxEntries: 300,
						maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
					},
				},
			},
		],
		// maximumFileSizeToCacheInBytes: 3000000,
	},
	// cache all the static assets in the static folder
	includeAssets: ['**/*'],
	manifest: {
		name: 'Field-TM',
		short_name: 'Field-TM',
		description: 'Coordinated field mapping for Open Mapping campaigns.',
		display: 'standalone',
		theme_color: '#d63f3f',
		background_color: '#d63f3f',
		icons: [
			{
				src: 'pwa-64x64.png',
				sizes: '64x64',
				type: 'image/png',
			},
			{
				src: 'pwa-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: 'pwa-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: 'maskable-icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
		screenshots: [
			{
				src: 'screenshot-mapper.jpeg',
				sizes: '1280x720',
				type: 'image/jpeg',
				form_factor: 'wide',
				label: 'Mapper App',
			},
		],
	},
};

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA(pwaOptions),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/translations',
		}),
		UnoCSS({
			extractors: [extractorSvelte()],
		}),
	],
	server: {
		host: true,
		port: 7057,
	},
	preview: {
		port: 7057,
	},
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			$components: path.resolve('./src/components'),
			$store: path.resolve('./src/store'),
			$routes: path.resolve('./src/routes'),
			$constants: path.resolve('./src/constants'),
			$static: path.resolve('./static'),
			$styles: path.resolve('./src/styles'),
			$assets: path.resolve('./src/assets'),
			$translations: path.resolve('./src/translations'),
			$migrations: path.resolve('/migrations'),
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	// assetsInclude: ['**/*.tar.gz'],
	optimizeDeps: {
		exclude: ['@electric-sql/pglite'],
	},
});
