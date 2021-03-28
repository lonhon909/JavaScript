var cacheName = 'my-cache'
var cacheList = ['/cache1.css', '/cache1.js']
self.addEventListener('install', function(event) {
  event.waitUntil(
    // 安装成功后向caches中存入需要缓存的文件  
    caches.open(cacheName).then(function (cache) {
        return cache.addAll(cacheList)
    })
  )
});
// 监听service worker fetch
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
        .then(function(response) {
            // 在缓存中查找到匹配的请求，就从缓存返回
            if (response) {
                console.log(response)
                return response;
            }
            // 缓存中没有查找到对应请求，继续网络请求
            return fetch(event.request);
        }
    )
  );
})