class Carousel {
  constructor(options = {}) {
    this.list = (options.list || []).map((item, index) => ({
      src: item,
      index,
    }));
    this.items = this.list;
    // 初始化轮播索引，默认0
    if (options.currentIndex < 0 || options.currentIndex > this.list.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = options.currentIndex;
    }
    this._currentIndex = this.currentIndex;
    // 是否自动轮播
    this.autoplay = options.autoplay || true;
    // 是否循环播放
    this.loop = options.loop || false;
    // 轮播间隔（自动轮播有效）
    this.speed = options.interval || 3000;
    // 走马灯高度
    this.height = options.height;
    // 动画
    this.animation = this.animation || 'ease';
    // 是否现实指示灯
    this.dot = options.dot || true;
    // 切换箭头的显示时机，hover，always，naver
    this.arrow = options.arrow || 'hover';

    if (options.el && typeof options.el === 'string') {
      const el = document.querySelector(options.el);
      this.el = el || undefined;
    }

    if (!this.list || !this.list.length) {
      throw new TypeError('list is empty');
    }
    if (!(this instanceof Carousel)) {
      throw new SyntaxError('请通过 new 关键字调用');
    }

    if (this.loop && this.list.length > 2) {
      const temp = [...this.list, ...this.list, ...this.list];
      let start = this.currentIndex + this.list.length - Math.floor(this.list.length / 2);
      
      this.items = temp.splice(start, this.list.length).map((item, index) => ({
        ...item,
        _index: index,
      }));
      this._currentIndex = Math.floor(this.list.length / 2);
    }

    this.init();
  }

  init() {
    const ul = document.createElement('ul');
    this.loop && ul.setAttribute('data-padding-left', this.items.length - 1);
    this.loop && ul.setAttribute('data-padding-right', this.items.length - 1);
    const dot = document.createElement('ul');
    dot.classList.add('dot');
    const fragment = document.createDocumentFragment();
    let list = this.items;
    const container = {
      width: this.el.clientWidth,
      height: this.el.clientHeight,
      top: this.el.offsetTop,
      left: this.el.offsetLeft,
    };
    this.container = container;
    const padding = this.loop ? [
      `padding-left:${container.width * (list.length - 1)}px;`,
      `padding-right:${container.width * (list.length - 1)}px;`,
      `transform:translateX(-${(this._currentIndex + list.length - 1) * container.width}px);`
    ] : [
      `transform:translateX(-${this._currentIndex * container.width}px);`
    ];
    const cssText = [
      `width:${list.length * container.width}px;`,
      `height:${this.height || `${container.height}px`};`,
      'display:flex;',
      'transition:transform 0.5s;',
      ...padding,
    ];
    ul.style.cssText = cssText.join('');
    console.log(cssText)
    for (let i = 0; i < list.length; i++) {
      const li = document.createElement('li');
      li.style.cssText = [
        `width:${container.width}px;`,
        'line-height:0;',
        'pointer-events:none;',
        'position:relative;',
      ].join('');
      const img = document.createElement('img');
      img.src = list[i].src;
      // **
      const div = document.createElement('div');
      div.innerHTML = list[i].index;
      div.classList.add('haha')
      // **
      img.classList.add('img');

      li.appendChild(img);
      li.appendChild(div);
      ul.appendChild(li); 
    }
    for (let i = 0, length = this.list.length; i < length; i++) {
      const dotLi = document.createElement('li');
      dotLi.setAttribute('data-index', this.list[i].index);
      if (i === this.currentIndex) {
        dotLi.classList.add('red');
      }
      dot.appendChild(dotLi);
    }
    dot.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      this.setCurrentIndex(+index);
    })
    if (this.el) {
      fragment.appendChild(dot);
      fragment.appendChild(ul);
      this.el.appendChild(fragment);
    }
  }

  next() {
    // debugger
    if (this.loop) {
      let i = this.currentIndex + 1;
      if (i > this.list.length - 1) {
        i -= 5;
      }
      this.setCurrentIndex(i);
      return;
    }
    if (this.currentIndex + 1 < this.list.length) {
      this.setCurrentIndex(this.currentIndex + 1);
    }
  }

  pre() {
    // debugger
    if (this.loop) {
      let i = this.currentIndex - 1;
      if (i < 0) {
        i += 5;
      }
      this.setCurrentIndex(i);
      return;
    }
    if (this.currentIndex - 1 >= 0) {
      this.setCurrentIndex(this.currentIndex - 1);
    }
  }

  setCurrentIndex(index) {
    debugger
    const ul = this.el.lastElementChild;
    let pl = ul.getAttribute('data-padding-left') || 0;
    let pr = ul.getAttribute('data-padding-right') || 0;
    const dot = this.el.lastElementChild.previousElementSibling;
    if (this.loop) {
      const _index = this.items.find(item => item.index === index)._index;
      const step = _index - this._currentIndex;
      this._currentIndex = _index;
      if (step > 0) {
        pl = +pl + 1;
        pr = +pr - 1;
        ul.style.paddingLeft = `${this.container.width * pl}px`;
        ul.style.paddingRight = `${this.container.width * pr}px`;
        ul.style.transform = `translateX(-${this.container.width * (_index + this.items.length - 1)}px)`;
        // ul.appendChild(ul.firstElementChild);
      } else {
        pl = +pl - 1;
        pr = +pr + 1;
        ul.style.paddingLeft = `${this.container.width * pl}px`;
        ul.style.paddingRight = `${this.container.width * pr}px`;
        ul.style.transform = `translateX(-${this.container.width * (_index + this.items.length - 1)}px)`;
        // ul.insertBefore(ul.lastElementChild, ul.firstElementChild);
      }
      ul.setAttribute('data-padding-left', pl);
      ul.setAttribute('data-padding-right', pr);
    } else {
      if (index === this.currentIndex) return;
      const list = this.items;
      const preOrNext = list[index]
      if (!preOrNext) return;
      ul.style.transform = `translateX(-${this.container.width * index}px)`;
    }
    this.currentIndex = index;

    for (let i = 0; i < dot.children.length; i++) {
      dot.children[i].classList.remove('red');
      if (i === this.currentIndex) {
        dot.children[i].classList.add('red');
      }
    }
  }

  getCurrentIndex() {
    return this.currentIndex;
  }
}
