## 一个生成 IconFont 的脚本
[![NPM version][npm-image]][npm-url]
这个是一个生成 iconfont 的脚本，使用很简单，他只有两个 `api` ，`1 个钩子函数`，以及 `6 个配置项`，但是大部分情况下，你只需要两个 api 就能完成所有的工作。使用时，你只需要将生成的 `css` 文件引入你的项目工程中就可以了，就像下面这样
```html
<link rel="stylesheet" href="./fonts/style.css">
```

## 一个最简单的 demo
```js
const { create } = require('@rustle/icon-font')

// string | object
create('./icons') // create 方法接收一个存储 icon 原始 svg 图片的路径或是一个配置的 object
```

## 完整的 demo
```js
const path = require('path')
const { create, remove } = require('@rustle/icon-font')

const url = __dirname + '/icon-font'
const aimsUrl = path.resolve(url, 'fonts')

// 生成每个 icon-font 之前会调用此钩子函数，接收三个参数
// name -> 此次生成的 icon 名字
// clone -> 可以克隆此次 icon，并设置新的信息，一般用于生成颜色不一样，但是其他信息一样的 icon
// svg -> 此次生产的 icon 的原始 svg string
create.before = (name, clone, svg) => {
  // 生成一个 active icon
  clone(`${name}-active`, {
    size: '51px', // 设置此次 icon 的大小
    color: '#2cb8ca', // 设置此次 icon 的颜色
  })
  // 同上
  return { size: '31px' }
}

// 每次先删除已经存在的文件，然后生成新的
remove(airmUrl).then(() => {
  create({
    from: url, // icon 图片存放的路径
    to: aimsUrl, // 生成的文件存放位置
    // demo: true, // 是否生成 demo.html，默认为 true
    // open: true, // 是否使用浏览器预览生成的 demo.html，默认为 true
    // cssname: 'style.css', // 生成的 css 文件名称，默认为 style.css
    // fontname: 'iconfont', // 生成的字体名称，默认为 iconfont
  })
})
```

## 目录结构
[生成文件的目录结构](https://github.com/imtaotao/icon-font/tree/master/icon-font/fonts)
```
+-- root
  +-- iconfont.eot
  +-- iconfont.svg
  +-- iconfont.ttf
  +-- iconfont.woff
  +-- demo.html
  +-- style.css
```

## 依赖
[font-carrier](https://github.com/purplebamboo/font-carrier)

[npm-image]: https://img.shields.io/npm/v/@rustle/icon-font.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@rustle/icon-font