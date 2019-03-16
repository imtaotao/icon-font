const Base = require('./base')
const Glyph = require('./glyph')
const config = require('../config')
const FontFace = require('./font-face')

module.exports = class Font extends Base {
  constructor (opts) {
    super(opts, config.DEFAULT_OPTIONS.font)
    this._glyphs = {}
    this._fontface = new FontFace()
  }

  // name 应该为 unicode 的16进制
  setGlyph (unicode, opts) {
    if (unicode && opts) {
      const glyph = new Glyph(opts)

      glyph.set('unicode', unicode)
      if (!glyph.get('glyphName')) {
        glyph.set('glyphName', 'uni' + unicode.replace(/(&#x)|(;)/g, ''))
      }
      glyph.setFont(this)
    }
  }
}