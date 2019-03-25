'use strict'

// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const fs = require('fs')

let config = {}
try {
  config = JSON.parse(fs.readFileSync(__dirname + '/config.json'))
} catch (e) {}
let apiHost = 'http://39.108.135.255:5001'
let wxHost = 'http://39.108.135.255:5000'
if (config.hasOwnProperty('apiHost')) {
  apiHost = config['apiHost']
}
if (config.hasOwnProperty('wxHost')) {
  apiHost = config['wxHost']
}

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.DEV_PORT || 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: apiHost,
        changeOrigin: true,
        pathRewrite: {'/api': ''}
      },
      '/wxcgi': {
        target: wxHost,
        changeOrigin: true,
        pathRewrite: {'/wxcgi': ''}
      },
      '/mock': {
        target: 'https://www.easy-mock.com/mock/597f1c6aa1d30433d84e0929/admin',
        changeOrigin: true,
        pathRewrite: {'/mock': ''}
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
