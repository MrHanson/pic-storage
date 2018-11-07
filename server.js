var express = require('express')
var app = express()
var cors = require('cors')
var uploadModle = require('./model/upload-model')
var getPicListModel = require('./model/getPicList-model')
var delPicModel = require('./model/delPic-model')

const PORT = 3000

app.use('/view', express.static('view'))
app.use('/img', express.static('img'))
app.use(cors())

app.get('/', function (req, res) {
  res.redirect('/view')
})

// 返回已上传到服务端图片的文件列表
app.get('/getPicList', function (req, res) {
  getPicListModel.getPicList(req, function (err, files) {
    if (err) {
      return res.send({
        errCode: 0,
        errMsg: '服务端开了个小差(⊙o⊙)…'
      })
    }

    files = files.map(element => `http://localhost:${PORT}/img/` + element)
    res.json({
      errCode: 1,
      picList: files
    })
  })
})

// 上传请求
app.post('/upload', function (req, res) {
  uploadModle.uploadPhoto(req, function (err, fields, uploadPath) {
    if (err) {
      return res.json({
        errCode: 0,
        errMsg: '上传图片错误'
      })
    }
    res.json({
      errCode: 1,
      errMsg: '上传成功',
      fields: fields,
      uploadPath: uploadPath
    })
  })
})

// 删除图片请求
app.delete('/delPic', function (req, res) {
  delPicModel.delPic(req, function (err) {
    if (err) {
      return res.send({
        errCode: 0,
        errMsg: '删除图片失败_(:з」∠)_'
      })
    }
    res.send({
      errCode: 1,
      errMsg: '删除图片成功'
    })
  })
})

var server = app.listen(PORT, function () {
  console.log('server is listening at http://localhost:%s', PORT)
})
