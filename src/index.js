const fs = require('fs')
const path = require('path')
const genCSSFile = require('./gen-css')
const fontCarrier = require('font-carrier')
const { warn, deleteDir, getPathColor, getLegalPath } = require('./utils')

// 调用钩子函数
function callHooks (hookname, data, obj) {
  const fn = create[hookname]
  return typeof fn === 'function'
    ? fn(data, obj)
    : null
}

// 得到字体的 svg string
function getSingleFont (from, type, file) {
  return new Promise(resolve => {
    const filePath = path.resolve(from, file)

    if (!fs.existsSync(filePath)) {
      console.warn(`${filePath} is not exists.`)
      resolve(null)
      return
    }

    if (path.extname(file).includes(type)) {
      fs.readFile(filePath, (err, data) => {
        if (err) warn(err)

        const name = path.basename(file, `.${type}`)
        resolve({
          name,
          svg: data.toString(),
        })
      })
      return
    }
    resolve(null)
  })
}

// 设置字体信息
function setIconAndGetInfor (font, name, unicode, opts, map) {
  unicode.index++
  const code = unicode.index

  // 允许克隆一个一样的 icon
  const clone = (_name, cfg) => {
    if (typeof _name === 'string') {
      if (_name === name) warn(`the ${name} already exists, please change your name.`)
      // copy svg 字符串
      cfg.svg = opts.svg
      const infor = setIconAndGetInfor(font, _name, unicode, cfg)
      map.push(infor)
    }
  }

  // clone 的情况下不调用钩子
  if (map) {
    const data = callHooks('before', name, clone)
    if (data && typeof data === 'object') {
      Object.assign(opts, data)
    }
  }

  const colors = opts.color || getPathColor(opts.svg)
  const fontName = String.fromCharCode(code)
  font.setGlyph(fontName, opts)

  return {
    name,
    colors,
    size: opts.size,
    code: code.toString(16),
  }
}

function init (opts) {
  const font = fontCarrier.create()

  fs.readdir(opts.from, (err, files) => {
    if (err) warn(err)

    const map = []
    const unicode = { index: 0xe090 }

    // 设置每个 iconfont
    const arr = files.map(file => {
      return getSingleFont(opts.from, 'svg', file).then(options => {
        if (!options) return
        const { svg, name } = options
        const infor = setIconAndGetInfor(font, name, unicode, { svg }, map)
        map.push(infor)
      })
    })
    
    Promise.all(arr).then(() => {
      // 生成字体
      fs.mkdir(opts.to, err => {
        if (err) warn(err)
        font.output({
          types: ['svg', 'ttf', 'eot', 'woff'],
          path: path.resolve(opts.to, opts.fontname),
        })
      })

      // 生成 css 文件
      if (map.length > 0) {
        genCSSFile(map, opts)
      }
    })
  })
}

// 设置 opions
function getOptions (opts) {
  if (typeof opts === 'string') {
    opts = {from: opts}
  }
  if (!opts || typeof opts.from !== 'string') {
    warn('the from path must be a string.')
  }

  opts.cssname = opts.cssname || 'style.css'
  opts.fontname = opts.fontname || 'iconfont'

  if (opts.to) {
    opts.originUrl = opts.to
  } else {
    Object.assign(opts, getLegalPath(opts.from, 'fonts'))
  }

  return opts
}

function create (opts) {
  opts = getOptions(opts)

  const res = callHooks(
    'createBefore',
    p => deleteDir(p || opts.originUrl),  // delete
    () => init(opts) // done
  )

  if (res === null) {
    init(opts)
  }
}

module.exports = create