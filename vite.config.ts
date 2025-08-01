import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined,
	plugins: [tailwindcss(), sveltekit()]
});
