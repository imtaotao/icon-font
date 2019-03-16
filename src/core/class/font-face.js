const Base = require('./base')
const config = require('../config')

module.exports = class FontFace extends Base {
  constructor (opts) {
    super(opts, config.DEFAULT_OPTIONS.fontface)
  }
}