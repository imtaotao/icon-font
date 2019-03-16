const font = require('./class/font')

module.exports = {
  create (opts) {
    return new font(opts)
  }
}