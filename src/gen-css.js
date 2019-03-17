const fs = require('fs')
const path = require('path')
const { warn } = require('./utils')

function fontface (fontname) {
  return '@font-face {\n\t' +
    `font-family: '${fontname}';\n\t` + 
    `src: url('${fontname}.eot?bilyuv#iefix') format('embedded-opentype'),\n\t` +
      `url('${fontname}.ttf?bilyuv') format('truetype'),\n\t` +
      `url('${fontname}.woff?bilyuv') format('woff'),\n\t` +
      `url('${fontname}.svg?bilyuv#${fontname}') format('svg');\n\t` +
    'font-weight: normal;\n\t' +
    'font-style: normal;\n' +
  '}\n\n'
}

function common (fontname) {
  return '[class^="icon-"], [class*=" icon-"] {\n\t' +
    '/* use !important to prevent issues with browser extensions that change fonts */\n\t' +
    `font-family: '${fontname}' !important;\n\t` +
    'speak: none;\n\t' +
    'font-style: normal;\n\t' +
    'font-weight: normal;\n\t' +
    'font-variant: normal;\n\t' +
    'text-transform: none;\n\t' +
    'line-height: 1;\n\t' +
    '\n\t' +
    '/* Better Font Rendering =========== */\n\t' +
    '-webkit-font-smoothing: antialiased;\n\t' +
    '-moz-osx-font-smoothing: grayscale;\n' +
  '}\n\n'
}

function genSingleIcon (icon) {
  const color = Array.isArray(icon.colors)
    ? icon.colors[0]
    : icon.colors

  const colorStr = color
    ? `\tcolor: ${color};\n`
    : ''

  const size = icon.size
    ? `\tfont-size: ${icon.size};\n`
    : ''

  return `.icon-${icon.name}:before {\n\t` +
    `content: "\\${icon.code}";\n` +
    size +
    colorStr +
  '}\n'
}

function icons (map) {
  let res = ''
  map.forEach(val => res += genSingleIcon(val))
  return res
}

function createFile (text, { to, cssname }) {
  const url = path.resolve(to, cssname)
  const stream = fs.createWriteStream(url)
  stream.write(text, err => {
    if (err) warn(err)
  })
}

module.exports = function genCSSFile (map, opts) {
  const commonStr = common(opts.fontname)
  const fontfaceStr = fontface(opts.fontname)
  const text = (fontfaceStr + commonStr + icons(map))

  createFile(text, opts)
  return text
}