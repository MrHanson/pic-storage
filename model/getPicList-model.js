var fs = require('fs')

module.exports = {
  getPicList: function (req, callback) {
    fs.readdir('./img', function (err, files) {
      if (err) {
        callback && callback(err, [])
        return
      }
      callback && callback(null, files)
    })
  }
}
