import path from 'path';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import UnoCSS from 'unocss/vite';
import extractorSvelte from '@unocss/extractor-svelte';

export default defineConfig({
	plugins: [
		sveltekit(),
		UnoCSS({
			extractors: [extractorSvelte()],
		}),
	],
	server: {
		host: true,
		port: 3000,
	},
	preview: {
		port: 3001,
	},
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			$components: path.resolve('./src/components'),
			$static: path.resolve('./static'),
			$store: path.resolve('./src/store'),
			$styles: path.resolve('./src/styles'),
			$assets: path.resolve('./src/assets'),
			$utilFunctions: path.resolve('./src/utilFunctions'),
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	optimizeDeps: {
		exclude: ['@electric-sql/pglite'],
	},
});
