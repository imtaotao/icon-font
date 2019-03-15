const fs = require('fs')
const path = require('path')

exports.warn = error => {
  throw new Error('Iconfont warn: ' + error)
}

// only transfer one string
exports.toHex = val => {
  return val.charCodeAt().toString(16)
}

exports.toStr = hex => {
  const code = parseInt(hex, 16)
  return String.fromCharCode(code)
}

exports.getLegalPath = function getLegalPath (from, to, index = 0) {
  let url = path.resolve(from, to)
  index && (url += index)

  if (!fs.existsSync(url)) return url
  return getLegalPath(from, to, index + 1)
}