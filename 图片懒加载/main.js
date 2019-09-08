
/**
 * top 和 left 是目标元素左上角坐标与网页左上角坐标的偏移值；
 * width 和 height 是目标元素自身的宽度和高度。
 * @param {*} el 
 * @return true即元素出现在视窗中， false即元素不在视图内
 */
function isElementInViewport(el) {
  const { top, height, left, width } = el.getBoundingClientRect();
  const w = window.innerWidth || document.documentElement.clientWidth;
  const h = window.innerHeight || document.documentElement.clientHeight;
  // top <= h  元素距离视窗顶部的距离 与 整个视窗的高度比较
  // (top + height) >= 0 元素从顶部往下滑动时，计算元素底部距离视窗顶部是否大于0，即元素底部是否从视窗顶部露出
  // left <= w 元素距离视窗左侧的距离与视窗的宽度比较
  // (left + width) >= 0
  return top <= h && (top + height) >= 0 && left <= w && (left + width) >= 0
}
// 方法一
/* function LazyLoad (el, options) {
  if (!(this instanceof LazyLoad)) {
    return new LazyLoad(el)
  }
  this.setting = Object.assign({}, {
    src: 'data-src',
    srcset: 'data-srcset',
    selector: '.lazyload'
  }, options)
  if (typeof el === 'string') {
    el = document.querySelectorAll(el)
  }
  this.images = Array.from(el);
  this.listener = this.loadImage();
  this.listener();
  this.initEvent();
}

LazyLoad.prototype = {
  loadImage () {
    function main() {
      let startIndex = 0;
      while (startIndex < this.images.length) {
        const image = this.images[startIndex]
        if (isElementInViewport(image)) {
          const src = image.getAttribute(this.setting.src)
          const srcset = image.getAttribute(this.setting.srcset)
          if (image.tagName.toLowerCase() === 'img') {
            if (src) {
              image.src = src
            }
            if (srcset) {
              image.srcset = srcset
            }
          } else {
            image.style.backgroundImage = `url(${src})`
          }
          this.images.splice(startIndex, 1)
          continue
        }
        startIndex++
      }
      
      if (!this.images.length) {
        this.destroy()
      }
    }
    return throttle(main).bind(this)
  },
  initEvent () {
    window.addEventListener('scroll', this.listener, false)
  },
  destroy () {
    window.removeEventListener('scroll', this.listener, false)
    this.images = null
    this.listener = null
  }
} */

function throttle (fn, interval = 500) {
  let timer = null
  let firstTime = true

  return function (...args) {
    if (firstTime) {
      // 第一次加载
      fn.apply(this, args)
      return firstTime = false
    }

    if (timer) {
      // 定时器正在执行中，跳过
      return
    }

    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
      fn.apply(this, args)
    }, interval)

  }
}
// 方法二
function LazyLoad (el, options = {}) {
  if (!(this instanceof LazyLoad)) {
    return new LazyLoad(el, options)
  }
  this.setting = Object.assign({}, {
    src: 'data-src',
    srcset: 'data-srcset',
    selector: '.lazyload'
  }, options)
  if (typeof el === 'string') {
    el = document.querySelectorAll(el)
  }
  this.images = Array.from(el);
  this.observer = null
  this.init()
}

LazyLoad.prototype.init = function () {
  let self = this
  let observerConfig = {
    root: null,
    rootMargin: '0px',
    threshold: [0]
  }
  this.observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const target = entry.target
      if (entry.intersectionRatio > 0) {
        this.observer.unobserve(target)
        const src = target.getAttribute(this.setting.src)
        const srcset = target.getAttribute(this.setting.srcset)
        if ('img' === target.tagName.toLowerCase()) {
          if (src) {
            target.src = src
          }
          if (srcset) {
            target.srcset = srcset
          }
        } else {
          target.style.backgroundImage = `url(${src})`
        }
      }
    })
  }, observerConfig)

  this.images.forEach(image => this.observer.observe(image))
}
