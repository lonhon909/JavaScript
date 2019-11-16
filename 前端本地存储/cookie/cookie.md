# cookie

> 存储的cookie数据，每次都会被浏览器自动放在http请求中

## 特征
- 不同的浏览器存放的cookie位置不一样，也是不能通用的
- cookie的存储是以域名形式进行区分的，不同的域下存储的cookie是独立的
- 我们可以设置cookie生效的域
- 一个域名下存放的cookie的个数是有限制的，不同的浏览器存放的个数不一样,一般为20个
- 每个cookie存放的内容大小也是有限制的，不同的浏览器存放大小不一样，一般为4KB
- cookie也可以设置过期的时间，默认是会话结束的时候，当时间到期自动销毁

```js
function setCookie(c_name, value, expiredays) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toGMTString());
}

setCookie('username','cfangxu',1);
setCookie('age', '25', 20);
```

## cookie 是怎么工作的
> js、css、img、http请求都会携带域名下的cookie

> 当网页要发http请求时，浏览器会先检查是否有相应的cookie， 有则自动添加在request header中的cookie字段中。这些是浏览器自动帮我们做的，而且每一次http请求浏览器都会自动帮我们做。 这个特点很重要，因为这关系到“什么样的数据适合存储在cookie中”

## cookie 的属性选项

### expires
> 设置“cookie 什么时间内有效”。expires其实是cookie失效日期
```js
new Date().toGMTString(); // Tue, 26 Feb 2019 02:08:48 GMT
new Date().toUTCString(); // Tue, 26 Feb 2019 02:09:18 GMT
```
> expires 是 http/1.0协议中的选项，在新的http/1.1协议中expires已经由 max-age 选项代替，两者的作用都是限制cookie 的有效时间。expires的值是一个时间点（cookie失效时刻= expires），而max-age 的值是一个以秒为单位时间段（cookie失效时刻= 创建时刻+ max-age）

### domain 和 path
> domain是域名，path是路径，两者加起来就构成了 URL，domain和path一起来限制 cookie 能被哪些 URL 访问

> 特别说明: <font color=#A52A2A>发生跨域xhr请求时，即使请求URL的域名和路径都满足 cookie 的 domain 和 path，默认情况下cookie也不会自动被添加到请求头部中</font>

### secure
> [sɪˈkjʊə(r)] adj.	安全的; 牢固的; 有把握的; 安心的;

> secure选项用来设置cookie只在确保安全的请求中才会发送。当请求是HTTPS或者其他安全协议时，包含 secure 选项的 cookie 才能被发送至服务器

### httpOnly
> 用来设置cookie是否能通过 js 去访问
- 在客户端是不能通过js代码去设置一个httpOnly类型的cookie的，这种类型的cookie只能通过服务端来设置

## 如何设置 cookie

### 服务端设置 cookie
![avatar](https://segmentfault.com/img/bVthn4)

- 一个set-Cookie字段只能设置一个cookie，当你要想设置多个 cookie，需要添加同样多的set-Cookie字段。
- 服务端可以设置cookie 的所有选项：expires、domain、path、secure、HttpOnly

### 客户端设置 cookie

```js
/**
 * 
 * @param {*} name 键名
 * @param {*} value 键值
 * @param {*} expires 过期时间
 * @param {*} domain 域名
 * @param {*} path 路径
 */
function setCookie2(name, value, expires, domain, path) {
  const time = new Date();
  time.setDate(time.getDate() + expires);
  let t = expires === undefined ? "" : ";expires=" + time.toGMTString();
  let d = domain === undefined ? "" : ";domain=" + domain;
  let p = path === undefined ? "" : ";path=" + path;
  document.cookie = name + "=" + escape(value) + t + d + p;
}
setCookie2('heigh3', 175, 3, '127.0.0.1', '/');
```