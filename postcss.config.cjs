module.exports = {
  plugins: {
    'postcss-logical': { preserve: false },
    'postcss-sorting': {
      'order': [
        'custom-properties',
        'dollar-variables',
        'declarations',
        'rules',
        'at-rules'
      ],
      'properties-order': 'flexible',
      'unspecified-properties-position': 'bottom'
    }
  }
};