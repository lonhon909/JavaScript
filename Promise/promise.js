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
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        // 在promise状态确定之后执行成功的回调队列
        this.onFulfilledCallbacks.forEach(fn => fn(this.value));
      }
    }
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        // 在promise状态确定之后执行失败的回调队列
        this.onRejectedCallbacks.forEach(fn => fn(this.reason));
      }
    }
    try {
      excutor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    // 成功态调用
    if (this.state === FULFILLED) {
      // 将成功态的信息传入
      onFulfilled(this.value);
    }
    // 失败态调用
    if (this.state === REJECTED) {
      // 将拒绝的原因传入
      onRejected(this.reason);
    }
    // 如果excutor有异步操作，需要将成功或失败的方法在异步返回之后执行，就需要先缓存
    if (this.state === PENDING) {
      this.onFulfilledCallbacks.push((value) => {
        onFulfilled(value);
      });
      this.onRejectedCallbacks.push((reason) => {
        onRejected(reason);
      });
    }
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

// module.exports = Promise;