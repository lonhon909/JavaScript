// Reflect.has方法对应name in obj里面的in运算符

const target = {
    name: 'Hello World'
}
Object.setPrototypeOf(target, { alias: 'top' });

const log = console.log;

const a = Reflect.has(target, 'name');
const b = Reflect.has(target, 'alias');


log(a, b); // true true

// es5写法
if ('name' in target) {
    log('es5')
}
// es6写法
if (Reflect.has(target, 'name')) {
    log('es6')
}
