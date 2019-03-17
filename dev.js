const path = require('path')
const { create, remove } = require('./src')

const url = __dirname + '/icon-font'

create.before = (name, clone) => {
  clone(name + '-active', {
    size: '51px',
    color: '#2cb8ca',
  })
  return { size: '31px' }
}

remove(path.resolve(url, 'fonts')).then(() => {
  create(url)
})