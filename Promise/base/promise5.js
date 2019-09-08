const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
  constructor(excutor) {
    this.state = PENDING; // promise状态
    this.value = undefined; // fulfilled返回的信息
    this.reason = undefined; // rejected拒绝的原因
    this.onFulfilledCallbacks = []; //成功态回调队列
    this.onRejectedCallbacks = []; //拒绝态回调队列
    const resolve = (value) => {
      // 为什么resolve 加setTimeout
      // 2.2.4规范 onFulfilled 和 onRejected 只允许在 execution context 栈仅包含平台代码时运行.
      // 注1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
      setTimeout(() => {
        // 状态一旦确定就不能再改变了
        if (this.state === PENDING) {
          this.state = FULFILLED;
          this.value = value;
          // 异步完成之后执行
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        }
      });
    }
    const reject = (reason) => {
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED;
          this.reason = reason;
          // 异步完成之后执行
          this.onRejectedCallbacks.forEach(fn => fn(this.reason));
        }
      });
    }

    excutor(resolve, reject);
  }
  // Promises/A+ 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因。
  then(onFulfilled, onRejected) {
    // Promises/A+ 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // Promises/A+ 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};
    let promise2;
    // 成功态调用
    if (this.state === FULFILLED) {
      promise2 = new Promise((resolve, reject) => {
        // 2.2.6规范 对于一个promise，它的then方法可以调用多次.
        // 当在其他程序中多次调用同一个promise的then时 由于之前状态已经为FULFILLED / REJECTED状态，则会走以下逻辑,
        // 所以要确保为FULFILLED / REJECTED状态后 也要异步执行onFulfilled / onRejected ,这里使用setTimeout
        setTimeout(() => {
          // Promises/A+ 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
          try {
            let x = onFulfilled(this.value);
            handlePromise(promise2, x, resolve, reject);
          } catch (error) {
            // Promises/A+ 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
            reject(error);
          } 
        });
      })
    }
    // 失败态调用
    if (this.state === REJECTED) {
      promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            // 将拒绝的原因传入
            let x = onRejected(this.reason);
            handlePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      })
    }
    // 异步执行 需要等待异步的结果，因此需要将函数缓存
    if (this.state === PENDING) {
      promise2 = new Promise((resolve, reject) => {
        // then 方法可以被同一个 promise 调用多次,需要依次将函数进行缓存
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
    // Promises/A+ then 方法必须返回一个 promise 对象
    return promise2;
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

Promise.all = function(promiseArrs) {
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
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  })
}
Promise.resolve = function (val) {
  return new Promise((resolve, reject) => resolve(val));
}
Promise.reject = function (val) {
  return new Promise((resolve, reject) => reject(val));
}

// 运行 [[Resolve]](promise, x) 需遵循以下步骤：
function handlePromise(promise2, x, resolve, reject) {
  // Promises/A+ 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (promise2 === x) {
    return reject(new TypeError('循环引用'));
  }
  // 如果x是一个promise对象 （该判断和下面 判断是不是thenable对象重复 所以可有可无）
  if (x instanceof Promise) {}
  // Promises/A+ 如果 x 为对象或者函数
  if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
    // Promises/A+ 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
    let called; // 避免多次调用
    try {
      let then = x.then;
      if (typeof then === 'function') {
        // Promises/A+ 如果 then 是函数，将 x 作为函数的作用域 this 调用之。传递两个回调函数作为参数resolvePromise、rejectPromise
        try {
          then.call(x, y => {
            // Promises/A+ 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
            if (called) return;
            called = true;
            handlePromise(promise2, y, resolve, reject);
          }, r => {
            // Promises/A+ 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
            if (called) return;
            called = true;
            reject(r);
          })
        } catch (error) {
          // Promises/A+ 如果调用 then 方法抛出了异常 e：
          if (called) return;
          called = true;
          reject(error);
        }
      } else {
        // Promises/A+ 如果 then 不是函数，以 x 为参数执行 promise
        resolve(x);
      }
    } catch (error) {
      // Promises/A+ 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // Promises/A+ 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

Promise.deferred = Promise.defer = function () { //这是promise的语法糖
  let dfd = {};
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = Promise;