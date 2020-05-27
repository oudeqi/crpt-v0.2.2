module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-for'), // 必须运行在postcss-nested和postcss-simple-vars插件之前
    require('postcss-each'),
    require('postcss-mixins'),
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('postcss-conditionals'),
    require('postcss-calc'),
    require('postcss-extend'),
    require('postcss-preset-env')({
      stage: 0,
      autoprefixer: { grid: true },
      browsers: '> 0.5%, last 2 versions',
      features: {
        'nesting-rules': true,
        'media-query-ranges': true,
        'custom-properties': true, // 是否转换自定义属性
        'custom-selectors': true,
        'custom-media-queries': true,
      }
    })
  ]
}
