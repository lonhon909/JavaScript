// Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。
const target = {
    name: 'Hello World'
}
Object.setPrototypeOf(target, { alias: 'top' });

const log = console.log;

const a = Reflect.get(target, 'name'); // 'Hello World'
const b = Reflect.get(target, 'alias'); // 'top'
const c = Reflect.get(target, 'sum'); // undefined

log(a);
log(b);
log(c);

// 如果第一个参数不是对象，Reflect.get方法会报错。