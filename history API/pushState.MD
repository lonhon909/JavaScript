# pushState(state, title, url)

> history.pushState(state, title, url); 修改当前页面url,添加一条历史记录，不刷新页面

+ state: 一个于指定网址相关的状态对象，popstate事件触发时，该对象会传入回调函数中。如果不需要这个对象，此处可以填null

+ title: 新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填null

+ url: 新的网址，必须与前页面处在同一个域。浏览器的地址栏将显示这个网址

```js
// https://www.baidu.com => https://www.baidu.com/#/home 添加hash
window.history.pushState(null, null, '#/home');
// history.length = 2,新增了一条历史记录
```

# replaceState(state, title, url)

> history.replaceState(state, title, url); 修改当前页面url,替换当前的历史记录，不刷新页面

```js
// https://juejin.im/timeline => https://juejin.im/timeline?home=2
history.replaceState(null, null,'?one')
// history.length = 1，替换当前历史记录
```