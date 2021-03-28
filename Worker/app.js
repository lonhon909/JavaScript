const express = require('express');

const fs = require('fs');

const app = express();

// 设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use(express.static('./static'));

app.get('/app.html', (req, res) => {
  res.set('Content-Type', 'text/html');
  fs.readFile('./static/index.html', 'utf-8', (err, result) => {
    res.send(result);
  })
})
app.post('/login', (req, res) => {
  res.send({
    age: 18
  })
})

app.listen(3009, () => {
  console.log('App running in localhost:3009')
})