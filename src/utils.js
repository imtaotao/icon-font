const fs = require('fs')
const path = require('path')

exports.warn = error => {
  throw new Error('Iconfont warn: ' + error)
}

exports.getPathColor = function (str) {
  const reg = /(<path[^\/]*)fill=['"]{1}([^'"]+)/g
  let res, colors = []
  while (res = reg.exec(str)) {
    const color = res[2].trim()
    if (color) {
      colors.push(color)
    }
  }
  return colors
}

exports.getLegalPath = function getLegalPath (from, to, index = 0) {
  let url = path.resolve(from, to)
  let originUrl = url

  if (index) {
    const preIndex = index - 1
    if (preIndex > 0) {
      originUrl += preIndex
    }
    url += index
  }

  if (!fs.existsSync(url)) {
    return {
      to: url,
      originUrl,
    }
  }
  return getLegalPath(from, to, index + 1)
}

// 删除文件夹的一些方法
function iterator (url, dirs) {
  const stat = fs.statSync(url)
  if(stat.isDirectory()){
    dirs.unshift(url)
    inner(url, dirs)
  } else if(stat.isFile()){
    fs.unlinkSync(url)
  }
}

function inner (p, dirs) {
  const arr = fs.readdirSync(p)
  for (const val of arr) {
    const url = path.resolve(p, val)
    iterator(url, dirs)
  }
}

exports.deleteDir = function (dir) {
  return new Promise(resolve => {
    if (!dir || !fs.existsSync(dir)) resolve()

    const dirs = []
    iterator(dir, dirs)
    for (const val of dirs) {
      fs.rmdirSync(val)
    }
    resolve()
  })
}