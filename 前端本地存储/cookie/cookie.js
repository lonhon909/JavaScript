function setCookie(c_name, value, expiredays) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  console.log(expiredays)
  document.cookie = c_name + "=" + escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toGMTString());
}

setCookie('username','cfangxu');
setCookie('age', '25', 20);

/*************************** 2、获取cookie -- document.cookie ***************************/
console.log(document.cookie); // username=cfangxu; age=25

/*************************** 3、cookie 的属性选项 ***************************/
// expires -- 设置有效时间（或者cookie失效时间）expires必须是 GMT 格式的时间
new Date().toGMTString(); // Tue, 26 Feb 2019 02:08:48 GMT
new Date().toUTCString(); // Tue, 26 Feb 2019 02:09:18 GMT
// 

document.cookie="age2=12; expires=Thu, 26 Feb 2116 11:50:25 GMT; domain=127.0.0.1; path=/";
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