
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