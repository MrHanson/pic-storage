var path = require('path')
var fs = require('fs')
var formidable = require('formidable')
var dateFormat = require('dateformat')

module.exports = {
  uploadPhoto: function (req, callback) {
    var form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../img')

    form.keepExtensions = true
    form.encoding = 'utf-8'

    form.onPart = function (part) {
      if (part.filename != '') {
        form.handlePart(part)
      }
    }

    // 收集传过来的所有图片
    var allFiles = []
    form.on('file', function (err, field, file) {
      allFiles.push([field, file])
    })

    form.parse(req, function (err, fields, files) {
      if (err) {
        console.log(err)
        callback && callback(err, null, null)
        return
      }
      if (!files.photo) {
        var errMsg = {
          errCode: -10,
          errMsg: '文件为空'
        }
        callback && callback(errMsg, null, null)
        return
      }

      var finalPathArr = []
      allFiles.forEach(function (file, index) {
        var fileInfo = file[0]

        var time = dateFormat(new Date(), "yyyymmddHHMMss")
        // fileInfo.path代表的是formidable为我们上传文件后绝对路径
        // 通过path的extname来获取图片后缀
        var extName = path.extname(fileInfo.path)
        var newName = time + '_' + Math.floor(Math.random() * 123456789) + extName

        // var oldPath = files.photo.path
        var oldPath = fileInfo.path
        var newPath = path.join(__dirname, '../img', newName)

        //修改文件的名
        fs.renameSync(oldPath, newPath)
        var finalPath = path
          .join('/img', newName)
          .split('\\')
          .join('/')
        finalPathArr.push(finalPath)
      })
      callback && callback(null, fields, finalPathArr)
    })
  }
}
