//Promise 的三种状态  (满足要求 -> Promise的状态)
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(excutor) {
    this.state = PENDING, // promise 的状态
    this.value = undefined; // fulfilled状态时 返回的信息
    this.reason = undefined // rejected状态时 拒绝的原因
    this.onFulfilledCallbacks = []; //成功态回调队列
    this.onRejectedCallbacks = []; //拒绝态回调队列
    //成功态回调
    const resolve = (value) => {
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        } 
      });
    }
    // 失败态的回调
    const reject = (reason) => {
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.forEach(fn => fn(this.reason));
        } 
      });
    }

    try {
      excutor(resolve, reject)
    } catch (error) {
      reject(error);
    }
  }
  // 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : y => y; //判断是否是一个函数
    onRejected = typeof onRejected === 'function' ? onRejected : err => { //判断是否是一个函数
        throw err; //注意，这里不是返回值，而是抛出错误
    }
    let promise2 = null;
    // 当有延时调用resolve()或reject()时
    if (this.state === PENDING) {
      promise2 = new MyPromise((resolve, reject) => {
        this.onFulfilledCallbacks.push((value) => {
          try {
            let x = onFulfilled(value);
            handlePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
        this.onRejectedCallbacks.push((reason) => {
          try {
            let x = onRejected(reason);
            handlePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      })
    }
    // 处理成功回调
    if (this.state === FULFILLED) {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value); // 获取成功回调的返回值
            handlePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(e);
          }
        });
      })
    }
    // 处理失败回调
    if (this.state === REJECTED) {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            handlePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      })
    }
    // promise需要支持链式调用
    return promise2;
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}
MyPromise.all = function(promiseArrs) {
  return new Promise((resolve, reject) => { //返回一个新的Promise
      let arr = []; //定义一个空数组存放结果
      let i = 0;
      function handleData(index, data) { //处理数据函数
          arr[index] = data;
          i++;
          if (i === promiseArrs.length) { //当i等于传递的数组的长度时 
              resolve(arr); //执行resolve,并将结果放入
          }
      }
      for (let i = 0; i < promiseArrs.length; i++) { //循环遍历数组
          promiseArrs[i].then((data) => {
              handleData(i, data); //将结果和索引传入handleData函数
          }, reject)
      }
  })
}
MyPromise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  })
}
MyPromise.resolve = function (val) {
  return new Promise((resolve, reject) => resolve(val));
}
MyPromise.reject = function (val) {
  return new Promise((resolve, reject) => reject(val));
}

MyPromise.deferred = MyPromise.defer = function () { //这是promise的语法糖
  let dfd = {};
  dfd.promise = new MyPromise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}


function handlePromise(promise2, x, resolve, reject) {
  if (promise2 === x) { //promise2是否等于x,也就是判断是否将自己本身返回
    return reject(new TypeError('循环引用')); //如果是抛出错误
  }
  //判断x不是bull且x是对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let called; //called控制resolve或reject 只执行一次，多次调用没有任何作用。
    try {
      let then = x.then;
      if (typeof then === 'function') { //如果是函数，就认为它是返回新的promise
        then.call(x, (y) => { //如果y是promise继续递归解析
          if (called) return;
          called = true;
          handlePromise(promise2, y, resolve, reject);
        }, (e) => {
          if (called) return;
          called = true;
          reject(e);
        })
      } else { //不是函数，就是普通对象
        resolve(x); //直接将对象返回
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else { //x是普通值，直接走then的成功回调
    resolve(x);
  }
}

module.exports = MyPromise;
