/**
 * 
 * @param fn 执行函数
 * @param wait 时间间隔
 * @param immeditae 是否立即执行一次
 */
function debounce2(fn: (...rest: any[]) => any, wait: number = 500, immediate: boolean = false): any {
  let timer: number|null = null;
  return function() {
    const ctx = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait)
      if (callNow) {
        fn.apply(ctx, args);
      }
    }
    timer = setTimeout(() => {
      fn.apply(ctx, args);
    }, wait);
  }
}