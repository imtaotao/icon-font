## 一个生成 IconFont 的脚本
这个是一个生成 iconfont 的脚本，使用很简单，他只有两个 `api` ，一个 `钩子函数`，以及 `5 个配置项`，但是大部分情况下，你只需要使用一个 `api`

## 一个最简单的demo
```js
const { create, remove } = require('icon-font')
const url = __dirname + '/icon-font'

remove(path.resolve(url, 'fonts')).then(() => {
  create(url)
})
```