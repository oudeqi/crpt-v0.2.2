const Glob = require('Glob');
const path = require('path');
const postcss = require('rollup-plugin-postcss');
const babel = require('rollup-plugin-babel');
const json = require('@rollup/plugin-json');
const url = require('@rollup/plugin-url');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

// const pages = [
//   {
//     plugins,
//     input: 'src/module/login/win.js',
//     output: {
//       file: 'html/login/win.js',
//       format: 'esm'
//     }
//   },
//   {
//     plugins,
//     input: 'src/module/login/frm.js',
//     output: {
//       file: 'html/login/frm.js',
//       format: 'esm'
//     }
//   }
// ]

const plugins = [
  commonjs(),
  resolve(),
  json(),
  url({
    emitFiles: false,
    publicPath: 'image/',
    fileName: '[name][extname]', // [hash]
    limit: 14336 // (14kb)
  }),
  postcss({
    modules: false,
    sourceMap: false,
    inject: true,
    // extract: true,
    // extract: 'dist/my-custom-file-name.css',
  }),
  babel({
    exclude: 'node_modules/**'
  }),
]

// 获取页面js文件
const getPages = (globs, format) => {
  let pages = []
  Glob.sync(globs).forEach(_path => { // src/module/login/win.js
    let extname = path.extname(_path) // .js
    let basename = path.basename(_path, extname) // win
    let pathname = path.dirname(_path) // src/module/login
    pages.push({
      input: _path,
      output: { // html/login/win.js
        file: `html/${pathname.split('/').reverse()[0]}/${basename}${extname}`,
        format: format || 'esm', // cjs esm iife amd umd system
        name: 'fn'
      },
      plugins
    })
  })
  return pages
};

// 获取入口js文件
const getEntrance = (input, format) => ({
  plugins,
  input: input || 'src/app/index.js',
  output: {
    file: 'index.js',
    format: format || 'esm'
  }
})

module.exports = {
  getPages,
  getEntrance
}
