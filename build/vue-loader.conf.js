/**
 * vue-loader解析器的配置
 */
'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    // 根据相关配置确定是否开启
    sourceMap: sourceMapEnabled,
    // 生产环境提取
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  // 转换成require调用；当使用这些标签(key)时，(value)使用require来引入
  // 例如：<img src="../image.png">
  // 转换成：
  // createElement('img', {
  //   attrs: {
  //     src: require('../image.png')
  //   }
  // })
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
