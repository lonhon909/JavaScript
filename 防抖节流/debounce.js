
/**
 * 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，
    如果设定的时间到来之前，又一次触发了事件，就重新开始计时
 * @param {*} fn 执行函数
 * @param {*} delay 延迟执行，如果这段时间有再次触发，则重新计时
 * @param {*} immediate 是否立即执行一次
 */
function debounce(fn, delay, immediate = false) {
  let timer = null;
  return function() {
    const context = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer)
    }
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay)
      if (callNow) {
        fn.apply(context, args);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }
}