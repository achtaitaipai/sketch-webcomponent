import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		outDir: 'docs/',
	},
	server: {
		hmr: {
			protocol: 'ws',
			host: 'localhost',
		},
	},
	base: '/pixynth/',
})
