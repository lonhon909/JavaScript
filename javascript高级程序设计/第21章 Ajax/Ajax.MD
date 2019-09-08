## 1、XMLHttpRequest对象

```js
// 创建ajax
function createXHR() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest(); // IE7+
  } else {
    return new ActiveXObject("microsoft.XMLHttp") // IE6,IE5
  }
}

const xhr = createXHR();
```

## 2、XHR的用法

- 第一个方法是 <font color=red>open('GET/POST', '请求地址', '是否异步')</font>

> 三个参数（请求类型，请求地址，是否异步）,如果发送的是同步（false）则js代码会等到服务器响应之后再继续执行。

```js
// open方法并不会发送请求，只是启动一个请求以备发送
xhr.open('GET', 'example.php', true);
```
- 第二个方法是<font color=red>send(null)</font>

> 接受一个参数，即要作为请求主体发送的数据，如果不需要请求主体发送数据，就需传入 null

```js
xhr.send(null);
```

- 第三个方法是<font color=red>abort()</font>

> 取消请求

```js
// 调用这个方法之后，XHR对象将会停止触发事件，也不再允许访问与响应相关的属性
xhr.abort();
```

- 第四个方法是<font color=red>setRequestHeader()</font>

> 两个参数（头部字段的名称， 头部字段的值），<font color=blue>必须在open()方法之后，send()方法之前调用</font>

```js
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('x-session', '123123123132');
```

- 第五个方法是<font color=red>getResponseHeader(key), getAllResponseHeaders()</font>

> getResponseHeader(key)获取指定字段的响应头信息，getAllResponseHeaders()获取全部的响应头信息

```js
xhr.getResponseHeader('content-type'); // "text/html;charset=utf-8"
xhr.getAllResponseHeaders(); // ... 由所有头信息组成的字符串
```

## 3、XHR各个字段

> XHR收到响应之后，<font color=red>会自动填充XHR对象的属性</font>

- responseText: 作为响应主体被返回的文本
- responseXML: 如果响应的类型是'text/xml 或 application/xml',这个属性将保存包含响应数据的XML DOM文档，对于非XML数据，该属性将为null
- status: 响应的HTTP状态码
- statusText: HTTP状态的说明

```js
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText)
  }
}
```

##### readyState状态码

> 只要readyState属性的值，有一个值变为另一个值，<font color=blue>都会触发一次onreadystatechange事件</font>

- 0： 未初始化， 尚未调用open()方法
- 1： 启动，已经调用open()方法，但尚未调用send()方法
- 2： 发送，已经调用send()方法，但尚未收到响应
- 3： 接收，已经接收到部分数据
- 4： 完成，已经接收到全部数据，可以在客户端使用了