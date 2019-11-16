const express = require('express');
const app = express();

// 协议名必填, 如果同时存在 http 和 https 就写两条s
const allowOrigin = ['http://127.0.0.1:5500', 'https://www.baidu.com'];

app.use(function(req, res, next) {
  const { method, headers: { origin, cookie } } = req;
  if (allowOrigin.includes(origin)) {
    // 开放多个域名的跨域访问权限
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // 设置哪个源可以访问我
  // res.setHeader('Access-Control-Allow-Origin', '*'/* "http://127.0.0.1:5500" */)
  // 允许哪个方法访问我
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST')
  // 设置一段时间内不需要再次预检查请求
  res.setHeader('Access-Control-Max-Age', 500);
  // 要求添加token
  res.setHeader('Access-Control-Allow-Headers', 'token')
  // 允许前端请求携带 Cookie
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (method === 'OPTIONS') {
    console.log('预检请求');
  } else if (!cookie) {
    //  如果不存在 Cookie 就设置 Cookie
    res.setHeader('Set-Cookie', 'quanquan=fe');
  }
  next()
})

app.post('/cors.do', function(req, res) {
    const data = {
      name: '张三'
    }
    res.setHeader('token', 'quanquan');
    res.setHeader('Access-Control-Expose-Headers', 'token');
    res.status(200).send(data);
})
app.get('/cors.do', function(req, res) {
  const data = {
    name: '张三'
  }
  res.setHeader('token', 'quanquan');
  res.setHeader('Access-Control-Expose-Headers', 'token');
  res.status(200).send(data);
})

app.listen(3000, function() {
    console.log('开始监听端口：3000')
})