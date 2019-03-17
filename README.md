## 一个生成 IconFont 的脚本
这个是一个生成 iconfont 的脚本，使用很简单，他只有两个 `api` ，`1 个钩子函数`，以及 `6 个配置项`，但是大部分情况下，你只需要两个 api 就能完成所有的工作。使用时，你只需要将生成的 `css` 文件引入你的项目工程中就可以了

## 一个最简单的 demo
```js
const { create } = require('icon-font')

create('./icons') // create 方法接收一个 icon 存储的路径或一个 object
```

## 完整的 demo
```js
const path = require('path')
const { create, remove } = require('icon-font')

const url = __dirname + '/icon-font'
const aimsUrl = path.resolve(url, 'fonts')

// 生成每个 icon font 之前会调用此钩子函数，callback 接受两个参数
// name -> 此次生成的 icon 名字
// clone -> 可以克隆此次 icon，并设置新的信息，一般用于生成颜色不一样，但是其他信息一样的 icon
create.before = (name, clone) => {
  // 生成一个 active icon
  clone(`${name}-active`, {
    size: '51px', // 设置此次 icon 的大小
    color: '#2cb8ca', // 设置此次 icon 的颜色
  })
  // 同上
  return { size: '31px' }
}

// 每次先删除以及存在的文件，然后生成新的
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
[目录结构](https://github.com/imtaotao/icon-font/tree/master/icon-font/fonts)