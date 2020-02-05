// Reflect.isExtensible方法对应Object.isExtensible，
// 返回一个布尔值，表示当前对象是否可扩展。

const target = {
    name: 'Hello World'
}

Object.freeze(target);

const a = Reflect.isExtensible(target);

console.log(a); // false