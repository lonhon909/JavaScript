// Reflect.getPrototypeOf方法用于读取对象的__proto__属性，
// 对应Object.getPrototypeOf(obj)。
const target = {
    name: 'Hello World'
}
Object.setPrototypeOf(target, { alias: 'top' });

const log = console.log;

const a = Reflect.getPrototypeOf(target);
const b = Object.getPrototypeOf(target);

log(a); // { alias: 'top' }
log(a === b); // true