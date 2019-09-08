// Promises/A+ 规范 一个 Promise 的当前状态必须为以下三种状态中的一种：
// 等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
  constructor(excutor) {
    this.state = PENDING; // promise状态
    this.value = undefined; // fulfilled返回的信息
    this.reason = undefined; // rejected拒绝的原因

    const resolve = (value) => {
      // 状态一旦确定就不能再改变了
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
      }
    }
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
      }
    }

    excutor(resolve, reject);
  }
  // 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因。
  /**
   * 
   * @param {*} onFulfilled 可选参数
   * @param {*} onRejected 可选参数
   */
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
  }  
}