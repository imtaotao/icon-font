module.exports = class Base {
  constructor (opts, defaultOpts) {
    this.setOptions(opts, defaultOpts)
  }

  get (key) {
    return this._opts[key]
  }

  set (key, val) {
    this._opts[key] = val
  }

  setOptions (opts, defaultOpts) {
    if (!this._opts) {
      this._opts = Object.assign({}, defaultOpts || {}) 
    }
    Object.assign(this._opts, opts)
  }
}