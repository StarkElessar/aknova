import { globSync } from 'glob';
import { parse,relative, resolve } from 'node:path';
import { defineConfig } from 'vite';
import { htmlInclude } from './vite-plugin-html-include';

export default defineConfig({
	publicDir: resolve(__dirname, 'public'),
	plugins: [
		htmlInclude({
			componentsDir: resolve(__dirname, 'src/shared')
		})
	],
	build: {
		outDir: resolve(__dirname, 'dist'),
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				'scripts/main': resolve(__dirname, 'src/scripts/main.ts'),
				'styles/main': resolve(__dirname, 'src/styles/main.css'),
				...Object.fromEntries(
					globSync('src/{scripts,styles}/views/**/page.{ts,css}').map(file => {
						const { dir } = parse(file);
						// Remove 'src/' prefix and don't include '/page' in the key
						// e.g., 'scripts/views/home'
						const relPath = relative('src', dir);

						return [
							// Use dir path without '/page'
							relPath,
							resolve(__dirname, file)
						];
					})
				)
			},
			output: {
				entryFileNames: 'assets/[name].js',
				assetFileNames: 'assets/[name].[ext]',
				chunkFileNames: 'assets/chunks/[name]-[hash].js',
			}
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@scripts': resolve(__dirname, 'src/scripts'),
			'@styles': resolve(__dirname, 'src/styles')
		}
	},
	server: {
		strictPort: true,
		host: '0.0.0.0',
		port: 3000
	}
});
