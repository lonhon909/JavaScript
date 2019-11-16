/**
 * 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。 节流会稀释函数的执行频率
 * @param {*} fn 需要执行的函数
 * @param {*} delay 如果连续触发，则最少间隔执行时间
 * @param {*} type 1为时间戳版，2位定时器版
 */
function throttle(fn, delay, type = 1) {
  let timer = null;
  let previous = 0;
  return function () {
    const args = arguments;
    const context = this;
    if (type === 1) {
      console.log(1)
      const now = Date.now();
      // 时间戳版会立即执行一次
      if (now - previous > delay) {
        fn.apply(context, args)
        previous = now;
      }
    } else {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(context, args);
          timer = null;
        }, delay);
      }
    }
  }
}