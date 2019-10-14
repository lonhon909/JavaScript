const express = require('express');
const app = express();

app.use('*', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/dev', function(req, res) {
  console.log(req.query)
  const cb = req.query.cb;
  res.send(`${cb}({name: 'quanquan', friend: 'guiling'})`)
})

app.listen(3000, function() {
  console.log('服务已启动，正在监听端口：' + 3000)
})