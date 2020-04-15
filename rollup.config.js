const glob = require('glob');
const path = require('path');
const postcss = require('rollup-plugin-postcss');
const babel = require('rollup-plugin-babel');
const json = require('@rollup/plugin-json');
const url = require('@rollup/plugin-url');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const html2 = require('rollup-plugin-html2');
const replace = require('@rollup/plugin-replace');
const copy = require('rollup-plugin-copy')
const getPages = (globs, format) => {
  let pages = []
  glob.sync(globs).forEach(_path => { // src/module/login/win.html
    let extname = path.extname(_path) // .html
    let basename = path.basename(_path, extname) // win
    let pathname = path.dirname(_path) // src/module/login
    pages.push({
      input: `${pathname}/${basename}.js`,
      extname,
      basename,
      pathname
    })
  })
  return pages
}

export default getPages('.src/**/*.html').map(page => {
  let { input, pathname, basename, extname } = page
  return {
    input,
    // inlineDynamicImports: true,
    output: {
      // dir: `html/${pathname.split('/').reverse()[0]}/`,
      file: `widget/html/${pathname.split('/').reverse()[0]}/${basename}.js`,
      format: 'esm', // cjs esm iife amd umd system
      // name: basename
    },
    external: ['apiready'],
    watch: {
      exclude: 'node_modules/**,html/**'
    },
    plugins: [
      resolve(),
      commonjs(),
      json(),
      replace({
        __buildEnv__: JSON.stringify(process.env.NODE_ENV || 'development')
      }),
      url({
        emitFiles: false,
        publicPath: 'widget/image/',
        fileName: '[name][extname]', // [hash]
        limit: 14336 // (14kb)
      }),
      postcss({
        modules: false,
        sourceMap: false,
        extract: true,
        // extract: `html/${pathname.split('/').reverse()[0]}/${basename}.css`,
        // inject: true,
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true
      }),
      html2({
        template: `${pathname}/${basename}${extname}`,
        // dest: `html/${pathname.split('/').reverse()[0]}/`, //${basename}${extname}
        fileName: `${basename}${extname}`,
        onlinePath: '.',
      }),
      copy({
        targets: [
          { src: 'widget', dest: '../' }
        ]
      })
    ]
  }
})
