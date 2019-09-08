## deepCopy深拷贝

### 第1步

```js
function deepCopy(source) {
  var result = {};
  for(var key in source) {
    // 只拷贝可枚举属性
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      // 判断第二层属性值是否为对象，是就递归
      if (typeof source[key] === 'object') {
        result[key] = deepCopy(source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}
```

### 第2步

```js
// 1、如果传入的是基础类型，就直接返回
// 2、考虑数组
function deepCopy(source) {
  // 非对象返回自身
  if (!isObject(source)) {
    return source;
  }
  // 数组兼容性
  var result = Array.isArray(source) ? [] : {};
  for(var key in source) {
    // 只拷贝可枚举属性
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      // 判断第二层属性值是否为对象，是就递归
      if (isObject(source[key])) {
        result[key] = deepCopy(source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}

function isObject(obj) {
  return typeof obj === 'object' && obj != null;
}
```

### 第三步  考虑循环引用

> <font color=red>递归爆栈</font>
```js
// 上面第二版无法实现循环引用的拷贝
a = {b: 1};
a.c = a;
deepCopy(a); // Maximum call stack size exceeded

// 解决方案很简单，其实就是循环检测，我们设置一个数组或者哈希表存储已拷贝过的对象，当检测到当前对象已存在于哈希表中时，取出该值并返回即可。
function deepCopy(source, uniqueList = []) {
  // 非对象返回自身
  if (!isObject(source)) {
    return source;
  }
  // 数组兼容性
  var result = Array.isArray(source) ? [] : {};
  // 获取是否已经拷贝过对象
  var uniqueData = find(uniqueList, source);
  // 数据已经存在，返回保存的数据，此举还可以解决拷贝的对象中多个属性对同一个对象的引用问题（此前拷贝会将两个属性的引用丢失，即不在指向同一个内存地址）
  if (uniqueData) {
    return uniqueData.result;
  }
  // 数据不存在，保存源数据，以及对应的引用
  uniqueList.push({
    source: source,
    result: result
  })
  for(var key in source) {
    // 只拷贝可枚举属性
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      // 判断第二层属性值是否为对象，是就递归
      if (isObject(source[key])) {
        // 将当前的uniqueList保存传入，以供查询
        result[key] = deepCopy(source[key], uniqueList);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}

function isObject(obj) {
  return typeof obj === 'object' && obj != null;
}

function find(arr, item) {
  for(var i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i];
    }
  }
  return null;
}
```

### 第4步 拷贝 <font color=red>Symbol</font>

```js
function deepCopy(source, uniqueList = []) {
  // 非对象返回自身
  if (!isObject(source)) {
    return source;
  }
  // 数组兼容性
  var result = Array.isArray(source) ? [] : {};
  // 获取是否已经拷贝过对象
  var uniqueData = find(uniqueList, source);
  // 数据已经存在，返回保存的数据
  if (uniqueData) {
    return uniqueData.result;
  }
  // 数据不存在，保存源数据，以及对应的引用
  uniqueList.push({
    source: source,
    result: result
  })
  // 获取Symbol键值属性对
  let symKeys = Object.getOwnPropertySymbols(source);
  if (symKeys.length) {
    symKeys.forEach(item => {
      if (isObject(source[item])) {
        result[item] = deepCopy(source[item], uniqueList)
      } else {
        result[item] = source[item];
      }
    })
  }
  for(var key in source) {
    // 只拷贝可枚举属性
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      // 判断第二层属性值是否为对象，是就递归
      if (isObject(source[key])) {
        // 将当前的uniqueList保存传入，以供查询
        result[key] = deepCopy(source[key], uniqueList);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}

function isObject(obj) {
  return typeof obj === 'object' && obj != null;
}

function find(arr, item) {
  for(var i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i];
    }
  }
  return null;
}
```

### 第5步

> 上面四步使用的都是递归方法，但是有一个问题在于会爆栈
```js
// RangeError: Maximum call stack size exceeded
```
```js
function deepCopy(x) {
  // 用来去重
  const uniqueList = [];
  let root = Array.isArray(x) ? [] : {};
  // 栈
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x
    }
  ]

  while(loopList.length) {
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = Array.isArray(data) ? [] : {};
    }
    

    let uniqueData = find(uniqueList, data);
    if (uniqueData) {
      parent[key] = uniqueData.target;
      break; // 中断本次循环
    }

    // 数据不存在
    // 保存源数据，在拷贝数据中对应的引用
    uniqueList.push({
        source: data,
        target: res,
    });

    // 获取Symbol键值属性对
    let symKeys = Object.getOwnPropertySymbols(data);
    if (symKeys.length) {
      symKeys.forEach(k => {
        if (isObject(data[k])) {
          if (data[k] instanceof Date) {
            res[k] = new Date(data[k])
          } else if (data[k] instanceof RegExp) {
            res[k] = new RegExp(data[k])
          } else {
            loopList.push({
              parent: res,
              key: k,
              data: data[k]
            })
          }
        } else {
          res[k] = data[k]
        }
      })
    }

    for(let k in data) {
      if (data.hasOwnProperty(k)) {
        if (isObject(data[k])) {
          if (data[k] instanceof Date) {
            res[k] = new Date(data[k])
          } else if (data[k] instanceof RegExp) {
            res[k] = new RegExp(data[k])
          } else {
            loopList.push({
              parent: res,
              key: k,
              data: data[k]
            })
          }
        } else {
          res[k] = data[k]
        }
      }
    }
  }
  return root;
}
```