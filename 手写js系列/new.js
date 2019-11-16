function _new() {
    // 创建一个空对象
    const result = {};
    // constructor即构造函数
    const [constructor, ...args] = [...arguments];
    // 实例对象的__proto__指向构造函数的原型
    // result.__proto__ = constructor.prototype; 或者
    Object.setPrototypeOf(result, constructor.prototype);
    // 执行构造函数 构造函数中的this指向这个创建的空对象
    const target = constructor.apply(result, args);
    // 如果构造函数没有返回对象，就返回this,即这个新创建的空兑现
    if (typeof target === 'object' || typeof target === 'function') {
        return target;
    }
    return result;
}