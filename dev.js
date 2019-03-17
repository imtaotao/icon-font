const create = require('./src')

create.createBefore = (del, done) => {
  del().then(done)
}

create.before = (name, clone) => {
  clone(name + '-active', {
    size: '50px',
    color: '#2cb8ca',
  })

  return { size: '30px' }
}
create(__dirname + '/icon-font')