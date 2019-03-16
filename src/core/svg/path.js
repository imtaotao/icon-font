const _ = require('lodash')
const svgpath = require('svgpath')

function generatePath(path, transforms) {
  const t = svgpath(path).abs()
  _.each(transforms, function(transform) {
    t.transform(transform)
  })
  return t.toString()
}

function parseNode(node, transforms) {
  let path = ''
  const newTransForms = transforms ? _.clone(transforms) : []

  if (node.getAttribute && node.getAttribute('transform')) {
    newTransForms.push(node.getAttribute('transform'))
  }

  if (!node.hasChildNodes() && node.tagName === 'path') {
    path = generatePath(node.getAttribute('d'), newTransForms)
  }

  if (node.hasChildNodes()) {
    _.each(node.childNodes, function(childNode) {
      path += parseNode(childNode, newTransForms)
    })
  }
  return path
}


exports.normalizePath = function (svgNode) {
  return parseNode(svgNode)
}