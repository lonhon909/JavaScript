// Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。
// 未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它

const target = {
    name: 'Hello World'
}

// 旧写法

Object.defineProperty(target, 'a', {
    value: 'a',
    writable: true,
    enumerable: true,
    configurable: true
})

// 新写法
Reflect.defineProperty(target, 'b', {
    value: 'b',
    writable: true,
    enumerable: true,
    configurable: true
})

console.log(target); // { name: 'Hello World', a: 'a', b: 'b' }