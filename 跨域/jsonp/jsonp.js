//获取header的第一个子元素
const head = document.querySelector("head");

/**
 * 生成随机字符串
 */
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
/**
 * jsonp请求的实现。返回一个promise对象对应请求成功和请求失败。
 * @param {*请求的url} url 
 * @param {*请求的参数} options 
 */
function jsonpRequest({url = '', options = {}}) {
  return new Promise((resolve, reject) => {
    try {
      if (!url) {
        reject({
          err: new Error("url不能为空"),
          result: null
        });
      }
      //创建一个script元素
      const scriptNode = document.createElement("script");
      //请求参数
      let data = options || {};
      //回调函数的具体值，服务器和客户端就根据这个方法名来确定请求与返回数据之间的对应。
      let cakllbackName = "jsonp" + makeid();
      // 把callback加入请求参数中
      data["cb"] = cakllbackName;
      // 拼接url
      var params = [];
      //参数的拼接与处理
      for (let [key, value] of Object.entries(data)) {
          params.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
      url = (url.indexOf("?")) > 0 ? (url + "&") : (url + "?");
      url += params.join("&");
      //把处理好的url赋值给script元素的src属性。
      scriptNode.src = url;
      // 把回调函数暴露为全局方法。script加载回来以后，会执行fnName对应的这个方法。
      window[cakllbackName] = function(res) {
        resolve({
          err: null,
          result: res
        })
        //请求完成。删除script元素
        head.removeChild(scriptNode);
        //全局对象中删除已经请求完成的回调方法
        delete window[cakllbackName];
      }
      // script元素遇到错误
      scriptNode.onerror = function(err) {
        reject({
            err: err,
            result: null
        })
        //删除script元素和全局回调方法
        head.removeChild(scriptNode);
        window[cakllbackName] && delete window[cakllbackName];
      }
      //指定元素类型
      scriptNode.type = "text/javascript";
      //把script元素添加到header元素中。到这里script元素就会自动加载src。也就是我们的请求发出去了。
      head.appendChild(scriptNode)
    } catch (error) {
      //异常处理捕获
      reject({
        err: error,
        result: null
      });
    }
  })
}

// export default jsonpRequest;
