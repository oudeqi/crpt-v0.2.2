module.exports = {
  plugins: {
    'postcss-preset-env': {
      stage: 0,
      autoprefixer: { grid: true },
      browsers: '> 0.5%, last 2 versions',
      features: {
        'nesting-rules': true
      }
    },
  }
}
