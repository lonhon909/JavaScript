// Reflect.set方法设置target对象的name属性等于value。
const target = {
    name: 'Hello World'
}
Object.setPrototypeOf(target, { alias: 'top' });

const log = console.log;

Reflect.set(target, 'name', 'hello');

const a = Reflect.get(target, 'name'); // 'hello'

log(a)