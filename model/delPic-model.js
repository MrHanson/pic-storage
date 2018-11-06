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

      const picPath = fields.picPath.split('/')[4]

      fs.unlink(`./img/${picPath}`, function (err) {
        callback && callback(err)
      })
    })
  }
}
