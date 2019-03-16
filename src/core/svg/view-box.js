const _ = require('lodash')

function getViewBox (svgNode) {
  if (!svgNode) return

  const viewbox = svgNode.getAttribute('viewBox').replace(',', ' ').split(' ')
  if (viewbox && viewbox.length === 4) {
    return _.map(viewbox, function(v) {
      return parseFloat(v)
    })
  }

  const width = parseFloat(svgNode.getAttribute('width'))
  const height = parseFloat(svgNode.getAttribute('height'))
  if (width != 0 && height != 0) {
    return [0, 0, width, height]
  }
}

function getViewPort (svgNode) {
  let width = parseFloat(svgNode.getAttribute('width'))
  let height = parseFloat(svgNode.getAttribute('height'))

  const viewbox = svgNode.getAttribute('viewBox').replace(',', ' ').split(' ')
  if (!width) width = parseFloat(viewbox[2])
  if (!height) height = parseFloat(viewbox[3])
  return [width, height]
}

// 根据 targetHeight 缩放 width
// 如: normalizeViewport([1024, 2048], 1024)
// #=> [0,0,512, 1024]
function getTargetViewbox (viewport, targetHeight) {
  let [width, height] = viewport

  if (height != targetHeight) {
    width = parseInt(targetHeight / height * width)
    height = targetHeight
  }

  return [0, 0, width, height]
}


function normalizeXY (viewbox, targetViewbox) {
  const [x, y] = viewbox
  const [targetX, targetY] = targetViewbox

  // 可能会有 x, y 偏移的情况，所以这边需要做出相应的转换
  if (x != targetX || y != targetY) {
    return [
      ['translate', [targetX - x, targetY - y]]
    ]
  }
  return []
}

function normalizeWidthHeight (viewbox, targetViewbox) {
  const width = viewbox[2]
  const height = viewbox[3]
  const targetWidth = targetViewbox[2]
  const targetHeight = targetViewbox[3]

  const widthScale = width / targetWidth
  const heightScale = height / targetHeight

  // 比较正常的等比缩放
  if (widthScale == heightScale) {
    return [
      ['scale', [1 / widthScale, 1 / widthScale]]
    ]
  }

  // 下面是不等比缩放
  // 不等比缩放后
  const transforms = []
  const maxScale = _.max([widthScale, heightScale])

  if (widthScale < heightScale) {
    const newWidth = targetWidth * maxScale
    transforms.push(['translate', [(newWidth - width) / 2, 0]])
  } else if (widthScale > heightScale) {
    const newHeight = newHeight * maxScale
    transforms.push(['translate', [0, (newHeight - height) / 2]])
  }

  transforms.push(['scale', [1 / maxScale, 1 / maxScale]])

  return transforms
}

//返回需要进行的转换数组
function normalizeViewBox (viewbox, targetViewbox) {
  let transforms = []
  transforms = transforms.concat(normalizeXY(viewbox, targetViewbox))
  transforms = transforms.concat(normalizeWidthHeight(viewbox, targetViewbox))
  return transforms
}

exports.generateAmendTrans = function (svgNode, targetHeight) {
  const viewbox = getViewBox(svgNode)
  const viewport = getViewPort(svgNode)
  const targetViewbox = getTargetViewbox(viewport, targetHeight)

  return {
    targetViewbox: targetViewbox,
    transforms: normalizeViewBox(viewbox, targetViewbox),
  }
}