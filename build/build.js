'use strict'
// 执行node和npm版本检查
require('./check-versions')()

// 设置node环境为production
process.env.NODE_ENV = 'production'

// 动画库
const ora = require('ora')
// 删除库
const rm = require('rimraf')
const path = require('path')
// 字体颜色库
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

// 动画实例
const spinner = ora('building for production...')
// 动画开始
spinner.start()

// 删除原来的文件，callback
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  // 如果有错误抛出错误
  if (err) throw err
  // 执行webpack打包
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
