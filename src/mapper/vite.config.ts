import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,
		port: 3000
	},
	preview: {
		port: 3001
	},
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			$components: path.resolve('./src/components'),
			$static: path.resolve('./static')
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
