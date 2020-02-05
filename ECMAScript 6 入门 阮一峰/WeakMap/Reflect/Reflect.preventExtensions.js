// Reflect.preventExtensions对应Object.preventExtensions方法，
// 用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

const target = {
    name: 'Hello World'
}

// 对象变为不可扩展
Reflect.preventExtensions(target);

const a = Reflect.isExtensible(target);

console.log(a); // false
