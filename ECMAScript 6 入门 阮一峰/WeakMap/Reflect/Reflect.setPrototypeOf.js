// Reflect.setPrototypeOf方法用于设置目标对象的原型（prototype），
// 对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功

const target1 = {
    name: 'Hello World'
}
const target2 = {
    name: 'Hello World'
}

const obj = { alias: 'top' };

// 旧写法
Object.setPrototypeOf(target1, obj);
// 新写法
Reflect.setPrototypeOf(target2, obj);

const log = console.log;

const a = Reflect.getPrototypeOf(target1);
const b = Reflect.getPrototypeOf(target2);

log(a === b); // true