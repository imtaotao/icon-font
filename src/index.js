const fs = require('fs')
const path = require('path')
const fontCarrier = require('font-carrier')

function warn (error) {
  throw new Error('Iconfont warn: ' + error)
}

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

function getLegalPath (from, to, index = 0) {
  let url = path.resolve(from, to)
  index && (url += index)

  if (!fs.existsSync(url)) return url
  return getLegalPath(from, to, index + 1)
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

function setFontInfor (font, name, options) {
  const data = callHooks('before', {
    name,
    svg: options.svg,
  })

  if (data && typeof data === 'object') {
    Object.assign(options, data)
  }
  font.setGlyph(name, options)
}

function create (opts) {
  opts = getOptions(opts)
  const font = fontCarrier.create()

  fs.readdir(opts.from, (err, files) => {
    if (err) warn(err)

    const arr = files.map(file => {
      return getSingleFont(opts.from, 'svg', file).then(options => {
        if (!options) return
        const {svg, name} = options
        setFontInfor(font, name, {svg})
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