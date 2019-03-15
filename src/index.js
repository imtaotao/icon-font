const fs = require('fs')
const path = require('path')
const fontCarrier = require('font-carrier')
const {
  toHex,
  toStr,
  warn,
  getLegalPath,
} = require('./utils')


function callHooks (hookname, data) {
  const fn = create[hookname]
  return typeof fn === 'function'
    ? fn(data)
    : null
}

function getOptions (opts) {
  if (typeof opts === 'string') {
    opts = {from: opts}
  }
  if (!opts || typeof opts.from !== 'string') {
    warn('the from path must be a string.')
  }

  opts.to = opts.to || getLegalPath(opts.from, 'fonts')
  opts.fontname = opts.fontname || 'iconfont'
  return opts
}

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

function setFontInfor (font, name, code, options) {
  code = code.toString(16)
  console.log(`${name} -- ${code}`);
  const data = callHooks('before', name)

  if (data && typeof data === 'object') {
    Object.assign(options, data)
  }

  options.glyphName = String.fromCharCode(code)
  font.setGlyph(code, options)
}

function create (opts) {
  opts = getOptions(opts)
  const font = fontCarrier.create()

  fs.readdir(opts.from, (err, files) => {
    if (err) warn(err)

    let baseUnitcode = 0xe090
    const arr = files.map(file => {
      return getSingleFont(opts.from, 'svg', file).then(options => {
        if (!options) return
        const {svg, name} = options
        setFontInfor(font, name, baseUnitcode++, {svg})
      })
    })

    Promise.all(arr).then(() => {
      fs.mkdir(opts.to, err => {
        if (err) warn(err)
        font.output({
          path: path.resolve(opts.to, opts.fontname),
        })
      })
    })
  })
}

module.exports = create