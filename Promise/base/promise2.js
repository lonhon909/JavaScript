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
      // 状态一旦确定就不能再改变了
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        // 异步完成之后执行
        this.onFulfilledCallbacks.forEach(fn => fn(this.value));
      }
    }
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        // 异步完成之后执行
        this.onRejectedCallbacks.forEach(fn => fn(this.reason));
      }
    }

    excutor(resolve, reject);
  }
  // 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因。
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
    // 异步执行 需要等待异步的结果，因此需要将函数缓存
    if (this.state === PENDING) {
      // then 方法可以被同一个 promise 调用多次,需要依次将函数进行缓存
      this.onFulfilledCallbacks.push((value) => {
        onFulfilled(value);
      })
      this.onRejectedCallbacks.push((reason) => {
        onRejected(reason);
      })
    }
  }  
}