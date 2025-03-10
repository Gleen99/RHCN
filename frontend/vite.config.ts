import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		server: {
			port: parseInt(env.VITE_PORT),

			https: {
				key: fs.readFileSync('localhost-key.pem'),
				cert: fs.readFileSync('localhost-cert.pem')
			},
			host: 'localhost',


		},
		build: {
			sourcemap: false,
			rollupOptions: {
				external: ['quill-delta-to-markdown']
			}
		},
		plugins: [vue()],

		resolve: {
			alias: {
				// @ts-ignore
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				// @ts-ignore
				'@shared': fileURLToPath(new URL('./src/shared', import.meta.url))
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
					quietDeps: true,
					additionalData: `@use "sass:math"; @use "@/scss/_variables" as *; @use "@/scss/_mixins" as *;`
				}
			}
		}
	}
});
