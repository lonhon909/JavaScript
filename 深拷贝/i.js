function isObject(data) {
  return typeof data === 'object' && data !== null;
}
/* 
  1、考虑原始类型
  2、考虑数组
  3、考虑对象自身属性（for in 会遍历原型属性）
  4、考虑循环引用
  5、考虑递归爆栈（不实用递归）
*/


function deep(data) {
  const map = new Map();
  function deepCopy(data) {
    if (!isObject(data)) {
      return data;
    }
    const result = Array.isArray(data) ? [] : {};
    if (map.has(data)) {
      return map.get(data)
    }
    map.set(data, result);
    for (let key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (isObject(data[key])) {
          result[key] = deepCopy(data[key])
        } else {
          result[key] = data[key];
        }
      }
    }
    // 考虑Symbol，
    const symbols = Object.getOwnPropertySymbols(data);
    symbols.forEach((item) => {
      if (isObject(data[item])) {
        result[item] = deepCopy(data[item]);
      } else {
        result[item] = data[item];
      }
    })
    return result;
  }
  return deepCopy(data)
}
