const fs = require('fs')
const path = require('path')
const { warn } = require('./utils')

function fontface (fontname) {
  return '@font-face {\n  ' +
    `font-family: '${fontname}';\n  ` + 
    `src: url('${fontname}.eot?bilyuv#iefix') format('embedded-opentype'),\n  ` +
      `url('${fontname}.ttf?bilyuv') format('truetype'),\n  ` +
      `url('${fontname}.woff?bilyuv') format('woff'),\n  ` +
      `url('${fontname}.svg?bilyuv#${fontname}') format('svg');\n  ` +
    'font-weight: normal;\n  ' +
    'font-style: normal;\n' +
  '}\n\n'
}

function common (fontname) {
  return '[class^="icon-"], [class*=" icon-"] {\n  ' +
    '/* use !important to prevent issues with browser extensions that change fonts */\n  ' +
    `font-family: '${fontname}' !important;\n  ` +
    'speak: none;\n  ' +
    'font-style: normal;\n  ' +
    'font-weight: normal;\n  ' +
    'font-variant: normal;\n  ' +
    'text-transform: none;\n  ' +
    'line-height: 1;\n\t' +
    '\n  ' +
    '/* Better Font Rendering =========== */\n  ' +
    '-webkit-font-smoothing: antialiased;\n  ' +
    '-moz-osx-font-smoothing: grayscale;\n' +
  '}\n\n'
}

function genSingleIcon (icon) {
  const color = Array.isArray(icon.colors)
    ? icon.colors[0]
    : icon.colors

  const colorStr = color
    ? `  color: ${color};\n`
    : ''

  const size = icon.size
    ? `  font-size: ${icon.size};\n`
    : ''

  return `.icon-${icon.name}:before {\n  ` +
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
  const text = fontfaceStr + commonStr + icons(map)

  createFile(text, opts)
  return text
}