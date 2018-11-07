var path = require('path')
var fs = require('fs')
var formidable = require('formidable')

module.exports = {
  delPic: function (req, callback) {
    var form = new formidable.IncomingForm()

    form.keepExtensions = true
    form.encoding = 'utf-8'

    form.onPart = function (part) {
      if (part.filename != '') {
        form.handlePart(part)
      }
    }

    // 收集传过来的所有图片路径
    var allPath = []
    form.on('field', function (name, value) {
      allPath.push(value)
    });

    form.parse(req, function (err, fields, files) {
      if (err) {
        callback && callback(err)
        return
      }
      if (!fields.picPath) {
        var errMsg = {
          errCode: -10,
          errMsg: '无效数据'
        }
        callback && callback(errMsg)
        return
      }

      allPath.forEach(function (path, index) {
        const picPath = path.split('/')[4]

        fs.unlink(`./img/${picPath}`, function (err) {
          if (err) {
            callback && callback(err)
            return
          }
        })
      })
      callback && callback(null)
      return
    })
  }
}
