import { resolve } from 'node:path';
import nunjucks from 'nunjucks';
import { defineConfig, type PluginOption } from 'vite';
import nunjucksPlugin from 'vite-plugin-nunjucks';

import accessories from './data/accessories.json';
import common from './data/common.json';
import faqAccordion from './data/faq-accordion.json';
import ourOffers from './data/our-offers.json';
import reviews from './data/reviews.json';
import usefulArticles from './data/useful-articles.json';

export default defineConfig(({ command }) => {
	const templatesDir = resolve(__dirname, 'src/shared');
	const basePath = process.env.GITHUB_PAGES === 'true' ? '/aknova' : '';

	// Функция для добавления basePath к путям изображений
	const addBasePathToImages = (obj: any): any => {
		if (typeof obj === 'string' && (obj.startsWith('/images') || obj.startsWith('/icons'))) {
			return basePath + obj;
		}
		if (Array.isArray(obj)) {
			return obj.map(addBasePathToImages);
		}
		if (obj && typeof obj === 'object') {
			const newObj: any = {};
			for (const key in obj) {
				newObj[key] = addBasePathToImages(obj[key]);
			}
			return newObj;
		}
		return obj;
	};

	// Обработка данных с добавлением basePath
	const processedOurOffers = addBasePathToImages(ourOffers);
	const processedAccessories = addBasePathToImages(accessories);
	const processedUsefulArticles = addBasePathToImages(usefulArticles);
	const processedReviews = addBasePathToImages(reviews);

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
				basePath,
				...common,
				...faqAccordion,
				...processedUsefulArticles,
				...processedReviews,
				...processedAccessories,
				...processedOurOffers
			},
			'about.html': {
				basePath
			}
		}
	});

	return {
		base: process.env.GITHUB_PAGES === 'true' ? '/aknova/' : '/',
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
