import { fileURLToPath, URL } from 'node:url'

import {defineConfig, loadEnv, type UserConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/


export default defineConfig(({mode }): UserConfig => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		server: {
			port: parseInt(env.VITE_PORT),
			fs: {
				allow: ['..']
			},
		},
		build: {
			sourcemap: false
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
					additionalData: `@use "sass:math"; @use "@/scss/_variables" as *; @use "@/scss/_mixins" as *;`				}
			}
		}
	}
});
