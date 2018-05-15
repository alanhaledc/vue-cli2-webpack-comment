/**
 * webpack生产环境配置
 */
'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
// webpack合并库，用来合并webpack配置
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// 复制插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// html插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 提取css样式的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 压缩提取出来的css的插件
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// 压缩js插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = require('../config/prod.env')

/**
 * 生产环境配置，合并且覆盖基本配置
 */
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // css配置，使用sourceMap和postcss，并且提取css
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  // sourceMap配置
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  // 输出
  output: {
    // 路径
    path: config.build.assetsRoot,
    // 文件名
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // 块的文件名（按需加载的块，比如路由懒加载）
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  // 插件
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 环境设置
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 压缩js
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          // 不保留警告
          warnings: false
        }
      },
      // 是否开启sourceMap
      sourceMap: config.build.productionSourceMap,
      // 是否开启并行
      parallel: true
    }),
    // extract css into its own file
    // 提取css样式插件，作为css文件作为单独文件
    new ExtractTextPlugin({
      // 文件名
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 压缩css样式插件
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // html插件，自动引入css和js样式
    new HtmlWebpackPlugin({
      // 文件名
      filename: config.build.index,
      // 参考模板
      template: 'index.html',
      // 是否注入css和js，默认true
      inject: true,
      // 压缩html
      minify: {
        // 删除注释
        removeComments: true,
        // 删除空格
        collapseWhitespace: true,
        // 删除元素的属性引号
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 模块排序
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    // 生产4位数的hash作为模块id
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    // 作用域提升
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // 抽取公共模块（第三方库）
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    // 拷贝插件，拷贝静态文件
    new CopyWebpackPlugin([
      {
        // 复制的来源文件夹
        from: path.resolve(__dirname, '../static'),
        // 复制的目标文件夹
        to: config.build.assetsSubDirectory,
        // 忽视的文件类型
        ignore: ['.*']
      }
    ])
  ]
})

/**
 * gzip压缩配置
 */
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      // 目标资源名称
      asset: '[path].gz[query]',
      // 算法
      algorithm: 'gzip',
      // 匹配
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      // 阀值，只处理比这个值大的资源，单位byte
      threshold: 10240,
      // 压缩率，只有压缩率比这个值小的资源才会被处理
      minRatio: 0.8
    })
  )
}

// 生成可视化report
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
