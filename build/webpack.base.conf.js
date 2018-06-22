/**
 * webpack基础配置
 */
'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

/**
 * 拼接绝对路径
 * @param dir
 * @return {*|string}
 */
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

/**
 * eslint配置
 * 箭头函数的立即执行函数
 * @return {{test: RegExp, loader: string, enforce: string, include: *[], options: {formatter: *, emitWarning: boolean}}}
 */
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  // 预处理：先用eslint-loader预处理代码格式，后面再用babel-loader,vue-loader编译
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

/**
 * 基本配置
 * @type {{context: *, entry: {app: string}, output: {path: *, filename: string, publicPath: string}, resolve: {extensions: string[], alias: {vue$: string, "@": (*|string)}}, module: {rules: *[]}, node: {setImmediate: boolean, dgram: string, fs: string, net: string, tls: string, child_process: string}}}
 */
module.exports = {
  // 上下文
  context: path.resolve(__dirname, '../'),
  // 入口
  entry: {
    app: './src/main.js'
  },
  // 输出
  output: {
    // 路径
    path: config.build.assetsRoot,
    // 文件名
    filename: '[name].js',
    // 公共路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  // 解析
  resolve: {
    // 扩展名，导入模块时可省略扩展名
    extensions: ['.js', '.vue', '.json'],
    // 别名
    alias: {
      // 指定完整的ES Module的vue版本
      // 注意runtime版本没有编译器，无法编译template模板
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  // 模块
  module: {
    rules: [
      // 如果需要eslint规范，把eslint的rules也放入
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // 导入vue-loader配置
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        // 图片文件
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 小于10000byte，转换为base64格式，减少请求次数，否则使用file-loader解析
          limit: 10000,
          // 文件名
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        // 多媒体文件
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        // 字体文件
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // node配置，阻止webpack注入一些无用的代码
  // false：不提供；empty：提供空对象； true：提供polyfill；mock：提供mock
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
