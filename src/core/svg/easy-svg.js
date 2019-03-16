const _ = require('lodash')
const Path = require('./path.js')
const svgpath = require('svgpath')
const CONFIG = require('../config.js')
const svgPathify = require('./pathify')
const Viewbox = require('./view-box.js')
const DOMParser = require('xmldom').DOMParser

exports.reversal = function (path) {
  return svgpath(path).scale(1, -1).round(CONFIG.PATH_DECIMAL).toString()
}

exports.normalizeSvg = function (svg, opts) {
  const svgDocNode = new DOMParser().parseFromString(svgPathify(svg), 'application/xml')
  const svgNode = svgDocNode.getElementsByTagName('svg')[0]

  //解决所有的变换，生成一个path
  const path = Path.normalizePath(svgNode)

  const trans = svgpath(path)

  //根据目标viewbox进行变换
  const targetHeight = opts.targetHeight
  
  if (targetHeight) {
    const viewObj = Viewbox.generateAmendTrans(svgNode, targetHeight)
    _.each(viewObj.transforms, function(viewTrans) {
      trans[viewTrans[0]].apply(trans, viewTrans[1])
    })

    return {
      viewbox: viewObj.targetViewbox,
      path: trans.round(CONFIG.PATH_DECIMAL).toString()
    }
  }
}