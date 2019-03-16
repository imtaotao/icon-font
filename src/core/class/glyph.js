const Base = require('./base')
const svgpath = require('svgpath')
const config = require('../config')
const easySvg = require('../svg/easy-svg.js')

module.exports = class Glyph extends Base {
  constructor (opts) {
    super(opts, config.DEFAULT_OPTIONS.glyph)

    const Font = require('./font')
    const FontFace = require('./font-face')

    this._font = new Font({
      id: config.FONT_FAMILY,
      horizAdvX: this.get('horizAdvX'),
      vertAdvY: this.get('vertAdvY'),
    })

    this._fontface = new FontFace({
      ascent: 0,
      descent: -this.get('vertAdvY'),
      unitsPerEm: this.get('vertAdvY'),
      fontFamily: config.FONT_FAMILY,
    })

    // 没有 d 参数，但是有 svg 参数，就进行转换
    if (!this.get('d') && opts.svg) {
      const pathObj = easySvg.normalizeSvg(opts.svg, {
        targetHeight: this._font.get('vertAdvY'),
      })

      // 翻转
      pathObj.path = easySvg.reversal(pathObj.path)
      this.set('d', pathObj.path)
      this.set('horizAdvX', pathObj.viewbox[2])
      this.set('vertAdvY', pathObj.viewbox[3])
    }
  }

  setFont (dstFont) {
    const dstFontAscent = dstFont._fontface.get('ascent')
    const curFontAscent = this._font._fontface.get('ascent')
    let path = this.get('d')

    // 当前有新的字体就需要做出转换
    if (this._font && this._font != dstFont) {
      //算出字体的比例，进行缩放还有参数变化
      const scale = this._font.get('vertAdvY') / dstFont.get('vertAdvY')
      const ascent = dstFontAscent * scale - curFontAscent
      path = svgpath(path).scale(1 / scale).translate(0, ascent).round(config.PATH_DECIMAL).toString()

      this.set('d', path)
      this.set('horizAdvX', parseInt(this.get('horizAdvX') / scale))
      this.set('vertAdvY', parseInt(this.get('vertAdvY') / scale))
    }

    const unicode = this.get('unicode')

    // 去掉老的引用
    // 只有引用的是自己才需要移除，
    // 因为存在一种情况就是这个 glyph 是使用当前的配置参数新建的
    // 但是跟老的具有相同的字体引用，不能误删
    if (this._font && this._font._glyphs[unicode] === this) {
      delete this._font._glyphs[unicode]
    }

    //设置新的引用
    dstFont._glyphs[this.get('unicode')] = this
    this._font = dstFont

    return dstFont
  }
}