module.exports = {
	plugins: {
		'postcss-import': {},
		'postcss-nested': {},
		'autoprefixer': {
			flexbox: 'no-2009',
			grid: 'autoplace'
		},
		'postcss-sort-media-queries': {
			sort: 'mobile-first'
		},
		'postcss-sorting': {
			'order': [
				'custom-properties',
				'dollar-variables',
				'declarations',
				'rules',
				'at-rules'
			],
			'unspecified-properties-position': 'bottom'
		}
	}
};
