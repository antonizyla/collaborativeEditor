import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './src/lib/server/websockets';

export default defineConfig({
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined,
	plugins: [tailwindcss(), sveltekit(), webSocketServer]
});
