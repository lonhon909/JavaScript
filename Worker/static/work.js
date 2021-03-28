function ajax(params) {
  return fetch('http://localhost:3009/login', {
    method: 'post'
  }).then((res) => Promise.resolve(res.json()));
}


/* 
  线程内部
  self: 代表子线程自身，也可用this

  子线程自身主动关闭: self.close()

  // Worker 内部如果要加载其他脚本，有一个专门的方法importScripts()
  Worker 加载脚本: importScripts('script1.js');

*/

// 监听主线程消息
self.addEventListener('message', (e) => {
  ajax(e.data).then((res) => {
    // 与主线程通讯
    self.postMessage(res)
  })
})
