/**
 * 检查node和npm的版本
 */
'use strict'
// 字体颜色库
const chalk = require('chalk')
// 版本检查库
const semver = require('semver')
const packageConfig = require('../package.json')
// shell节点库
const shell = require('shelljs')

// 执行命令的函数
function exec(cmd) {
  // 调用子进程执行命名，并且把结果转成字符串和去掉空格
  return require('child_process').execSync(cmd).toString().trim()
}

// 版本需求
const versionRequirements = [
  {
    name: 'node',
    // 获取系统当前版本号，clean清除多余的字母比如v
    currentVersion: semver.clean(process.version),
    // 从package.json中获取要求的版本
    versionRequirement: packageConfig.engines.node
  }
]

// 确认系统是否安装了npm
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    // 通过命令获取系统当前的版本号
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []

  // 遍历数组
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    // 匹配版本号（系统当前版本号和package.json要求的的版本号）
    // 如果匹配失败，警告消息保存到数组里
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  // 如果数组中有警告消息（即匹配失败），打印消息
  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
}
