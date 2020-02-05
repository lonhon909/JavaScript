// Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性

const target = {
    name: 'Hello World'
}
Object.setPrototypeOf(target, { alias: 'top' });

const log = console.log;

const a = Reflect.deleteProperty(target, 'name');

log(a); // true 删除成功返回true
log(Reflect.has(target, 'name')); // false