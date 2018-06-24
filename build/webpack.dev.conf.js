/**
 * webpack开发环境配置
 */
'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
// webpack合并库，用来合并webpack配置
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
// 复制插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// html插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 友好的错误提示插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 端口查找库
const portfinder = require('portfinder')

// 地址和端口
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

// 开发环境配置，合并且覆盖基本配置
const devWebpackConfig = merge(baseWebpackConfig, {
  // 模块
  module: {
    // css配置，使用sourceMap和postcss
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
  },
  // cheap-module-eval-source-map is faster for development
  // sourceMap配置
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  // 服务器配置
  devServer: {
    // 消息提示等级（none，info，warnings，error）：警告消息以上才提示
    clientLogLevel: 'warning',
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html ？？？
    // 当使用vue-router路由的history模式时，需要指定任意的页面都跳转到编译后的index.html中,不然devServer会无法识别路径
    historyApiFallback: {
      rewrites: [
        {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')}
      ]
    },
    // 热加载
    hot: true,
    // 静态文件目录，默认为当前文件夹，使用CopyWebpackPlugin后关闭
    contentBase: false, // since we use CopyWebpackPlugin.
    // 是否启用gzip压缩
    compress: true,
    // 主机地址
    host: HOST || config.dev.host,
    // 端口
    port: PORT || config.dev.port,
    // 是否自动打开浏览器启动页面
    open: config.dev.autoOpenBrowser,
    // 是否全屏覆盖消息
    overlay: config.dev.errorOverlay
      // 只有出现错误信息时才全屏覆盖，警告信息不覆盖
      ? {warnings: false, errors: true}
      // 关闭（都不覆盖）
      : false,
    // 公共路径
    publicPath: config.dev.assetsPublicPath,
    // 代理
    proxy: config.dev.proxyTable,
    // 安静模式，webpack的错误和警告信息不显示，使用FriendlyErrorsPlugin需要打开
    quiet: true, // necessary for FriendlyErrorsPlugin
    // 与监视有关的选项
    watchOptions: {
      // 轮询：false
      poll: config.dev.poll
    }
  },
  plugins: [
    // 配置全局常量
    new webpack.DefinePlugin({
      // 全局环境为开发环境
      'process.env': require('../config/dev.env')
    }),
    // 热加载模块插件
    new webpack.HotModuleReplacementPlugin(),
    // 显示热更新模块的名字
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // 在webpack编译出现错误时，跳过错误编译，使得编译后的文件不会包含错误代码
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // html插件，自动引入css和js文件
    new HtmlWebpackPlugin({
      // 文件名
      filename: 'index.html',
      // 参照模板
      template: 'index.html',
      // 是否注入css和js，js放置在body标签中
      inject: true
    }),
    // copy custom static assets
    // 复制插件， 用于复制静态文件
    new CopyWebpackPlugin([
      {
        // 复制的来源文件夹
        from: path.resolve(__dirname, '../static'),
        // 复制的目标文件夹
        to: config.dev.assetsSubDirectory,
        // 忽视的文件类型
        ignore: ['.*']
      }
    ])
  ]
})

/**
 * 用promise对象封装
 * @type {Promise<any>}
 */
module.exports = new Promise((resolve, reject) => {
  // 默认端口
  portfinder.basePort = process.env.PORT || config.dev.port
  // 获取端口（端口必须是空闲的）
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 重置端口
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      // 添加友好的消息提示插件
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        // 成功提示信息
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },
        // 错误提示信息
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      // 返回配置
      resolve(devWebpackConfig)
    }
  })
})
