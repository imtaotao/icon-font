const fs = require('fs')
// const create = require('./src')

// create(__dirname + '/icons')
const font = require('./src/core').create()
// const font = require('font-carrier').create()
font.setGlyph('mime', {
  glyphName: '我',
  horizAdvX: '1024',//设置这个字形的画布大小为1024
  svg:fs.readFileSync('./icons/编辑.svg').toString()
})