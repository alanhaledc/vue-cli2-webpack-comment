/**
 * webpack配置参数
 */
'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    // 静态资源文件夹
    assetsSubDirectory: 'static',
    // 公共路径（CDN地址或者服务器地址）
    assetsPublicPath: '/',
    // 代理
    proxyTable: {},

    // Various Dev Server settings
    // 主机地址
    host: 'localhost', // can be overwritten by process.env.HOST
    // 端口
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    // 启动服务器后是否自动打开浏览器
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    // 是否使用eslint
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // map类型
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // 是否使用css的map
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    // 文件名
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    // 输出路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 静态资源文件夹
    assetsSubDirectory: 'static',
    // 公共路径
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    // 是否开启sourceMap
    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    // sourceMap类型
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 是否开启gzip,开启之前需要安装compression-webpack-plugin
    productionGzip: false,
    // gzip压缩的文件类型
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 是否生成可视化report，需要设置npm_config_report的布尔值
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
