// Reflect.ownKeys方法用于返回对象的所有属性，
// 基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。

const symbol = Symbol();

const target = {
    name: 'Hello World',
    [symbol]: 100
}

const log = console.log;

// es5
const a = Object.getOwnPropertyNames(target);
const b = Object.getOwnPropertySymbols(target);

// es6
const c = Reflect.ownKeys(target);

log(a); // [ 'name' ]
log(b); // [ Symbol() ]
log(c); // [ 'name', Symbol() ]
