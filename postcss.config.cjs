module.exports = {
  plugins: {
    'postcss-sort-media-queries': {
      sort: 'mobile-first' // Сортирует и объединяет медиа-запросы от меньших к большим
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