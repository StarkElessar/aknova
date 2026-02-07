import { globSync } from 'glob';
import { parse, relative, resolve } from 'node:path';
import nunjucks from 'nunjucks';
import { defineConfig, type PluginOption } from 'vite';
import nunjucksPlugin from 'vite-plugin-nunjucks';

export default defineConfig(({ command }) => {
	const nunjucksPluginInstance = nunjucksPlugin({
		templatesDir: resolve(__dirname, 'src/shared'),
		nunjucksEnvironment: nunjucks.configure(resolve(__dirname, 'src/shared'), {
			autoescape: true,
			noCache: command === 'serve'
		}),
		variables: {}
	});

	return {
		publicDir: resolve(__dirname, 'public'),
		plugins: [
			nunjucksPluginInstance as PluginOption
		],
		build: {
			outDir: resolve(__dirname, 'dist'),
			emptyOutDir: true,
			rollupOptions: {
				input: {
					'scripts/main': resolve(__dirname, 'src/scripts/main.ts'),
					'styles/main': resolve(__dirname, 'src/styles/main.scss'),
					...Object.fromEntries(
						globSync('src/{scripts,styles}/views/**/page.{ts,css,scss}').map(file => {
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
					chunkFileNames: 'assets/chunks/[name]-[hash].js'
				}
			}
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
				'@scripts': resolve(__dirname, 'src/scripts'),
				'@styles': resolve(__dirname, 'src/styles')
			}
		}
	};
});
