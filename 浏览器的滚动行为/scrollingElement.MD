## scrollingElement

- 桌面端 document.body.scrollTop一直是0，说明桌面端滚动元素是document.documentElement；
- 移动端 document.documentElement.scrollTop一直是0，说明移动端滚动元素是document.body；

```js
// scrollingElement
// 标准模式返回documentElement，怪异模式返回body

// 以前的写法
let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

// scrollingElement写法
let scrollHeight = document.scrollingElement.scrollHeight
```