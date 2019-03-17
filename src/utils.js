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

exports.deleteDir = function (_path) {
  return new Promise(resolve => {
    if (!fs.existsSync(_path)) resolve()
    console.log(_path);
    resolve()
  })
}