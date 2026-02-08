import { resolve } from 'node:path';
import nunjucks from 'nunjucks';
import { defineConfig, type PluginOption } from 'vite';
import nunjucksPlugin from 'vite-plugin-nunjucks';

import common from './data/common.json';

export default defineConfig(({ command }) => {
	const templatesDir = resolve(__dirname, 'src/shared');

	const nunjucksPluginInstance = nunjucksPlugin({
		templatesDir,
		nunjucksEnvironment: nunjucks.configure(
			templatesDir,
			{
				autoescape: true,
				noCache: command === 'serve'
			}
		),
		variables: {
			'index.html': {
				...common
			}
		}
	});

	return {
		publicDir: resolve(__dirname, 'public'),
		plugins: [
			nunjucksPluginInstance as PluginOption
		],
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
	};
});
