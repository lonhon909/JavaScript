interface Fn {
  (...rest: any[]): any
}

// 事件总线----调度中心
interface EventChunnel {
  on: (eventName: string, callback: Fn) => any
  once: (eventName: string, callback: Fn) => any
  emit: (eventName: string, ...rest: any[]) => any
  off: (eventName: string, callback?: Fn) => any
}

class EventBus implements EventChunnel {
  private events: Record<string, Fn[]> = {}

  // 订阅
  on(eventName: string, callback: Fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // 发布
  emit(eventName: string, ...rest: any[]) {
    const callbacks = this.events[eventName];
    if (!callbacks || !callbacks.length) {
      return false;
    }
    callbacks.forEach((fn: Fn) => fn(...rest))
  }

  // 取消订阅
  off(eventName: string, cb?: Fn) {
    const callbacks = this.events[eventName];
    if (!callbacks || !callbacks.length) {
      return false;
    }
    if (!cb) {
      this.events[eventName] = [];
    } else {
      for(let i = 0; i < callbacks.length; i++) {
        if (callbacks[i] === cb || callbacks[i].fn === cb) {
          callbacks.splice(i, 1);
          break;
        }
      }
    }
    // 使支持链式
    return this;
  }

  // 监听一次
  once(eventName: string, cb: Fn) {
    function _on() {
      this.off(eventName, _on);
      cb(...arguments);
    }
    _on.fn = cb;
    this.on(eventName, _on);
  }
}


const eventBus = new EventBus();

function tmp() {
  console.log(100)
}

eventBus.on('click', tmp);

document.body.addEventListener('click', function() {
  eventBus.emit('click');
})