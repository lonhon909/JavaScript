/* 模拟实现 --- call方法 */

/* 
    1、调用apply/call方法的时候会立即执行（区别于bind）
    2、apply/call方法调用者的this会改变指向
    3、
*/

// bind实现
var value = '哈哈哈';
function mTest(id = '') {
    console.log(this.value + id)
    return this.value + id;
}
let data = {
    value: '啧啧啧',
}
console.log(mTest(12))
// console.log(mTest.bind(data)(100)); // 啧啧啧100


// 2、面向过程
Function.prototype.call2 = function(thisArg, ...args) {
    if (typeof thisArg === 'object') {
        thisArg = thisArg;
    } else {
        thisArg = Object(thisArg);
    }
    let s = Symbol();
    thisArg[s] = this; // 现将方法添加到目标对象上
    console.log(thisArg[s], '**')
    let result = thisArg[s](...args); // 在目标对象上调用，此时this自然而然指向目标对象
    delete thisArg[s]; // 将方法删除
    return result;
}
console.log(mTest.call2(data, 12))
console.dir(mTest)