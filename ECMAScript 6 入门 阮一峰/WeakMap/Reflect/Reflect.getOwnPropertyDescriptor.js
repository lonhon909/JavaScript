// Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，
// 用于得到指定属性的描述对象，将来会替代掉后者


const target = {
    name: 'Hello World'
}
Object.defineProperty(target, 'a', {
    value: 'a',
    writable: true,
    enumerable: true,
    configurable: true
})

const a = Reflect.getOwnPropertyDescriptor(target, 'a');

console.log(a); // { value: 'a', writable: true, enumerable: true, configurable: true }