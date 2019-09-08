# RequireJS是一个工具库

> 主要用于客户端的模块管理。它可以让客户端的代码分成一个个模块，实现异步或动态加载

> RequireJS的基本思想是，通过define方法，将代码定义为模块；通过require方法，实现代码的模块加载。

## 1、define定义模块
> define方法用于定义模块，RequireJS要求每个模块放在一个单独的文件里。

```js
// 独立模块
// a.js
define(function() {
  return {
    add: function(arr = []) {
      return arr.reduce((initial, current) => {
        return initial + current
      }, 0)
    }
  }
})
```

```js
// 非独立模块
// b.js
define(['module1', 'module2'], function(m1, m2) {
  ...
})
// 或者  require方法也可以用在define方法内部。
define(function(require) {
  const m1 = require('module1');
  const m2 = require('module2');
  ...
})
```

```js
// 上面代码定义了一个中间模块，该模块先判断浏览器是否支持__proto__属性（除了IE，其他浏览器都支持），如果返回true，就加载zepto库，否则加载jQuery库。
define(('__proto__' in {} ? ['zepto'] : ['jquery']), function($) {
    return $;
});
```

## 2、require调用模块

```js
// require方法的第一个参数，是一个表示依赖关系的数组
require(['js/b', 'js/a'], function(b, a) {
  console.log(a.add([1, 2, 3, 4, b]))
});
// 数组可以写得很灵活
require( [ window.JSON ? undefined : 'util/json2' ], function ( JSON ) {
  JSON = JSON || window.JSON;

  console.log( JSON.parse( '{ "JSON" : "HERE" }' ) );
});
```