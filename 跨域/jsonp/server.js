// server.js
let express = require('express')
let app = express();


app.get('/jsonp.do', function(req, res) {
  let { wd, cb } = req.query;
  const data = {
    name: '张三'
  }
  res.end(`${cb}(${JSON.stringify(data)})`)
})

app.listen(3000, function() {
  console.log('开始监听端口：3000')
})
