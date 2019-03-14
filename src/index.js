const fs = require('fs')
const path = require('path')
const fontCarrier = require('font-carrier')

function getSingleFont (targetPath, type, file) {
  return new Promise(resolve => {
    const filePath = path.resolve(targetPath, file)

    fs.exists(filePath, exists => {
      if (!exists) {
        console.warn(`${filePath} is not exists.`)
        return
      }
      if (path.extname(file).includes(type)) {
        fs.readFile(filePath, (err, data) => {
          if (err) throw new Error(err)
          const name = path.basename(file, `.${type}`)
          resolve({
            name,
            svg: data.toString(),
          })
        })
      }
    })
  })
}

function setFontInfor (font, name, options) {
  if (typeof create.before === 'function') {
    const data = create.before(name, options.svg)
    if (data && typeof data === 'object') {
      Object.assign(options, data)
    }
  }
  font.setGlyph(name, options)
}

function create (targetPath, aimsPath) {
  const font = fontCarrier.create()

  fs.readdir(targetPath, (err, files) => {
    if (err) throw new Error(err)
    files.forEach(file => {
      const type = 'svg'
      getSingleFont(targetPath, type, file).then(({name, svg}) => {
        console.log(name)
      })
    })
  })
}

create(__dirname + '/../icons', __dirname + '/../icons2')
