class Carousel {
  constructor(options) {
    this.list = options.list.map((item, index) => ({
      src: item,
      index: index + 1,
    }));
    this._list = [];
    // 初始化轮播索引，默认0
    if (options.currentIndex < 0 || options.currentIndex > this.list.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = options.currentIndex;
    }
    // 是否自动轮播
    this.autoplay = options.autoplay || true;
    // 是否循环播放
    this.loop = options.loop || false;
    // 轮播间隔（自动轮播有效）
    this.speed = options.interval || 3000;
     // 动画
     this.animation = this.animation || 'ease';
     // 是否现实指示灯
     this.dot = options.dot || true;
     // 左右切换箭头
    this.arrow = options.arrow || true;

    if (options.el && typeof options.el === 'string') {
      const el = document.querySelector(options.el);
      this.el = el || undefined;
    }
    if (!this.el) {
      this._el = document.createDocumentFragment();
    }
    this.init();
    if (this.dot) {
      this.initDot();
    }
    if (this.arrow) {
      this.initArrow();
    }
  }
  // 初始化
  init() {
    const ul = document.createElement('ul');
    ul.style.cssText = 'display:flex;margin-left:0;';
    const list = [...this.list, ...(this.loop ? [this.list[0]] : [])];
    for (let i = 0; i < list.length; i++) {
      const li = document.createElement('li');
      li.style.cssText = 'line-height:0;';
      const img = document.createElement('img');
      img.src = list[i].src;
      img.style.cssText = 'max-width:384px;max-height:216px;';
      const div = document.createElement('div');
      div.classList.add('flag');
      div.innerText = list[i].index;
      li.appendChild(img);
      li.appendChild(div);
      ul.appendChild(li);
    }
    if (this.el) {
      this.el.appendChild(ul);
    } else {
      this._el.appendChild(ul);
    }
    this.ul = ul;
    if (this.autoplay && this.el) {
      this.autoPlayLoop();
    }
  }
  // 初始化指示灯
  initDot() {
    const ul = document.createElement('ul');
    ul.style.cssText = 'position:absolute;left:0;width:100%;bottom:20px;display:flex;justify-content:center;';
    for (let i = 0; i < this.list.length; i++) {
      const li = document.createElement('li');
      li.style.cssText = 'width:10px;height:10px;border-radius:50%;margin:0 10px;background-color:#cccccc;opacity:0.5;cursor:pointer;';
      if (i === this.currentIndex) {
        li.classList.add('red');
      }
      li.setAttribute('data-index', i);
      ul.appendChild(li);
    }
    if (this.el) {
      this.el.appendChild(ul);
    } else {
      this._el.appendChild(ul);
    }
    this.dot = ul;
    ul.addEventListener('click', (e) => {
      this.setCurrentIndex([this.currentIndex, +e.target.getAttribute('data-index')]);
    })
  }
  // 初始化左右箭头
  initArrow() {
    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    const left = document.createElement('div');
    left.classList.add('left');
    const right = document.createElement('div');
    right.classList.add('left');
    right.classList.add('right')
    arrow.appendChild(left);
    arrow.appendChild(right);
    if (this.el) {
      this.el.appendChild(arrow);
    } else {
      this._el.appendChild(arrow);
    }
    arrow.addEventListener('click', (e) => {
      if (e.target === left) {
        this.pre();
      } else if (e.target === right) {
        this.next();
      }
    })
  }
  // 下一个
  next() {
    console.log('next');
    const ul = this.el.firstElementChild;
    if (!this.loop) {
      if (this.currentIndex + 1 === this.list.length) return;
      this.setCurrentIndex([this.currentIndex, this.currentIndex + 1]);
    } else {
      if (this.currentIndex === ul.children.length - 1) {
        this.setCurrentIndex([this.currentIndex, 0, 1]);
        this.currentIndex = 0;
      } else {
        this.setCurrentIndex([this.currentIndex, this.currentIndex + 1]);
      }
    }
  }
  // 上一个
  pre() {
    // debugger
    console.log('pre');
    const ul = this.el.firstElementChild;
    if (!this.loop) {
      if (this.currentIndex - 1 < 0) return;
      this.setCurrentIndex([this.currentIndex, this.currentIndex - 1]);
    } else {
      if (this.currentIndex === 0) {
        // ul.style.marginLeft = `-${ul.children.length * 384}px`;
        
        this.setCurrentIndex([this.currentIndex, ul.children.length - 1, ul.children.length - 2]);
        this.currentIndex = ul.children.length - 2;
      } else {
        this.setCurrentIndex([this.currentIndex, this.currentIndex - 1]);
      }
    }
  }
  // 点击指示灯设置index
  setCurrentIndex(list) {
    // debugger
    const ul = this.el.firstElementChild;
    console.log(list, '**')
    if (list.length === 3) {
      ul.style.marginLeft = `-${list[1] * 384}px`;
      this.animation(list.splice(1, 2));
    } else {
      this.animation(list);
    }
    this.currentIndex = list[list.length - 1];
    this.resetDot();
  }
  animation(anim) {
    const ul = this.el.firstElementChild;
    const step = (anim[1] - anim[0]) / 20;
    let i = 0;
    let t;
    (function fn() {
      ul.style.marginLeft = `-${(anim[0] + ++i * step) * 384}px`;
      t = requestAnimationFrame(fn)
      if (i >= 20) {
        cancelAnimationFrame(t)
      }
    })()
  }
  // 获取当前index
  getCurrentIndex() {
    return this.currentIndex;
  }
  // 自动播放
  autoPlayLoop() {
    setInterval(() => {
      this.next();
    }, this.speed);
  }
  resetDot() {
    const dotLi = this.dot.children;
    for (let i = 0; i < dotLi.length; i++) {
      dotLi[i].classList.remove('red');
      if (i === this.currentIndex % this.list.length) {
        dotLi[i].classList.add('red');
      }
    }
  }
  // 挂载
  mount(ele) {
    let container;
    if (ele && typeof ele === 'string') {
      container = document.querySelector(ele);
    } else if (ele instanceof HTMLElement) {
      container = ele;
    }
    let html = this.el ? this.el.firstElementChild : this._el;
    container.appendChild(html);
  }
}