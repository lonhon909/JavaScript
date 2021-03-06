// 调度中心
class Event {
  constructor() {
    this.event = new Map();
  }
  // 订阅
  on(eventName, callback) {
    if (!this.event.has(eventName)) {
      this.event.set(eventName, [])
    }
    this.event.get(eventName).push(callback);
    return this;
  }
  // 取消订阅
  off(eventName, fn) {
    if (!this.event.has(eventName)) {
      return false;
    }
    if (!fn) {
      // 直接清空所有的订阅
      this.event.delete(eventName);
    } else {
      let cb;
      const callbackArray = this.event.get(eventName);
      for (let i = 0; i < callbackArray; i++) {
        cb = callbackArray[i];
        // cb.fn === fn(针对一次性订阅once)
        if (cb === fn || cb.fn === fn) {
          callbackArray.splice(i, 1);
          break;
        }
      }
    }
    return this;
  }
  // 监听一次
  once(eventName, fn) {
    function _on() {
      this.off(eventName, _on);
      fn(...arguments)
    }
    // 缓存函数用于取消订阅
    _on.fn = fn;
    this.on(eventName, _on);
  }
  // 发布
  emit(eventName, ...rest) {
    // 判断是否有订阅该事件
    if (!this.event.has(eventName)) {
      return false;
    }
    const callbackArray = this.event.get(eventName);
    // 遍历 event 值对应的缓存列表，依次执行 fn
    callbackArray.forEach(fn => fn(...rest));

    return this;
  }
}

const bus = new Event();

function onMessage(cb, eventName) {
  bus.on(eventName, (params) => {
    console.log(params, '***')
    cb(params);
  }).on(eventName, () => {
    console.log('1000')
  });
}

function Emit(eventName, params) {
  bus.emit(eventName, params);
}

onMessage((res) => {
  console.log(res)
}, 'aaa')

setTimeout(() => {
  Emit('aaa', { age: 18 })
}, 2000)