const PENDING = 'Pending';
const FULFILLED = 'Fulfilled';
const REJECTED = 'Rejected';

class MyPromise {
  constructor(exector) {
    this.state = PENDING;
    this.value = undefined; // 成功的结果
    this.reason = undefined; // 失败的原因
    this.onFulfilledCallbacks = []; //成功态回调队列
    this.onRejectedCallbacks = []; //拒绝态回调队列

    const resolve = (value) => {
      // setTimeout(() => {
        if (this.state === PENDING) {
          this.state = FULFILLED;
          this.value = value;
          setTimeout(() => {

            this.onFulfilledCallbacks.forEach((fn) => fn(this.value))
          })
        }
      // })
    }
    const reject = (reason) => {
      // setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED;
          this.reason = reason;
          setTimeout(() => {

            this.onRejectedCallbacks.forEach((fn) => fn(this.reason))
          })
        }
      // })
    }
    try {
      exector(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  
  then(onFulfilled, onRejected) {
    // A+规定：如果 onFulfilled 不是函数，其必须被忽略，这里如果不是函数直接覆盖
    if (typeof onFulfilled !== 'function') {
      onFulfilled = (value) => value;
    }
    // A+规定：如果 onRejected 不是函数，其必须被忽略，这里如果不是函数直接覆盖
    if (typeof onRejected !== 'function') {
      onRejected = (reason) => { throw reason };
    }

    let promise2;

    // 成功态调用
    if (this.state === FULFILLED) {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            // resolve(x)
            handlePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      })
    }

    // 失败态调用
    if (this.state === REJECTED) {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            // resolve(x);
            handlePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      })
    }

    if (this.state === PENDING) {
      promise2 = new MyPromise((resolve, reject) => {
        this.onFulfilledCallbacks.push((value) => {
          try {
            let x = onFulfilled(value);
            // resolve(x);
            handlePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error);
          }
        })
  
        this.onRejectedCallbacks.push((value) => {
          try {
            const x = onRejected(value);
            // resolve(x);
            handlePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error);
          }
        })
      })
    }
    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

}

MyPromise.all = function(promiseArrs) {
  return new MyPromise((resolve, reject) => { //返回一个新的Promise
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
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  })
}
MyPromise.resolve = function (val) {
  return new MyPromise((resolve, reject) => resolve(val));
}
MyPromise.reject = function (val) {
  return new MyPromise((resolve, reject) => reject(val));
}

function handlePromise(promise2, x, resolve, reject) {
  // 1、如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (promise2 === x) {
    return reject(new TypeError('循环引用'))
  }
  // 2、x 为 Promise
  // 如果x是一个promise对象 （该判断和下面 判断是不是thenable对象重复 所以可有可无）
  if (x instanceof MyPromise) {}
  // 3、x 为对象或函数
  if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
    let called; // 避免多次调用
    try {
      // 3.1、把 x.then 赋值给 then
      let then = x.then;
      // 3.3、如果 then 是函数，将 x 作为函数的作用域 this 调用之。传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
      if (typeof then === 'function') {
        try {
          then.call(x, y => {
            // 3.3.1、如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
            if (called) return;
            called = true;
            handlePromise(promise2, y, resolve, reject);
          }, r => {
            // 3.1.1.2、如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
            if (called) return;
            called = true;
            reject(r);
          })
        } catch (error) {
          // 3.1.1.4、如果调用 then 方法抛出了异常 e
          if (called) return;
          called = true;
          reject(error);
        }
      } else {
        // 3.1.2、如果 then 不是函数，以 x 为参数执行 promise
        resolve(x);
      }
    } catch (error) {
      // 3.2、如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // 3.4、如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

MyPromise.deferred = MyPromise.defer = function () { //这是promise的语法糖
  let dfd = {};
  dfd.promise = new MyPromise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

// module.exports = MyPromise;