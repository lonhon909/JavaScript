class ListScroll {
  constructor(options) {
    this.init(options);
  }
  init(options) {
    if (!options || typeof options !== 'object') {
      throw new Error('options is empty');
    }

    const {
      firstItemId,
      lastItemId,
      itemHeight,
      container,
      listSize,
      renderFunction
    } = options;

    this.firstItemId = firstItemId;
    this.lastItemId = lastItemId;
    this.itemHeight = itemHeight;
    this.container = container;
    this.listSize = listSize;
    this.renderFunction = renderFunction;

    this.firstItem = document.getElementById(firstItemId);
    this.lastItem = document.getElementById(lastItemId);

    this.domDataCache = {
      currentPaddingTop: 0,
      currentPaddingBottom: 0,
      topSentinelPreviousY: 0,
      topSentinelPreviousRatio: 0,
      bottomSentinelPreviousY: 0,
      bottomSentinelPreviousRatio: 0,
      currentIndex: 0
    };
  }

  getWindowFirstIndex(scrollDirection) {
    const { currentIndex } = this.domDataCache;
    // 以全部容器内所有元素的一半作为增量
    const increment = Math.floor(this.listSize / 2);

    let firstIndex = currentIndex;
    // 向上滑动
    if (scrollDirection === 'top') {
      firstIndex += increment;
    } else { // 向下滑动
      firstIndex -= increment;
    }
    if (firstIndex < 1) {
      firstIndex = 1;
    }

    return firstIndex
  }
  adjustPaddings(scrollDirection) {
    const { container, itemHeight } = this;
    const { currentPaddingTop, currentPaddingBottom } = this.domDataCache;
    // 每次增加或减少的padding为增量实际高度
    const remPaddingsVal = itemHeight * (Math.floor(this.listSize / 2));

    let newCurrentPaddingTop, newCurrentPaddingBottom;

    // 向上滚动
    if (scrollDirection === 'top') {
      newCurrentPaddingTop = currentPaddingTop + remPaddingsVal;
      if (currentPaddingBottom === 0) {
        newCurrentPaddingBottom = 0;
      } else {
        newCurrentPaddingBottom = currentPaddingBottom - remPaddingsVal;
      }
    } else {
      newCurrentPaddingBottom = currentPaddingBottom + remPaddingsVal;
      if (currentPaddingTop === 0) {
        newCurrentPaddingTop = 0;
      } else {
        newCurrentPaddingTop = currentPaddingTop - remPaddingsVal;
      }
    }
    container.style.paddingBottom = `${newCurrentPaddingBottom}px`;
    container.style.paddingTop = `${newCurrentPaddingTop}px`;

    this.updateDomDataCache({
      currentPaddingTop: newCurrentPaddingTop,
      currentPaddingBottom: newCurrentPaddingBottom
    });
  }

  bottomItemCb(el) {
    const { bottomSentinelPreviousY, bottomSentinelPreviousRatio } = this.domDataCache;

    // isIntersecting 从非交叉到交叉（true），从交叉到非交叉（false）
    const isIntersecting = el.isIntersecting;
    // 目标元素的边界信息 同getBoundingClientRect()
    const currentY = el.boundingClientRect.top;
    const currentRatio = el.intersectionRatio;
    // console.log(currentRatio)
    // 从非交叉-->交叉，即向上滑动
    if (
      // currentY < bottomSentinelPreviousY &&
      // currentRatio >= bottomSentinelPreviousRatio &&
      isIntersecting
    ) {
      const firstIndex = this.getWindowFirstIndex('top');
      this.renderFunction(firstIndex);

      this.updateDomDataCache({
        currentIndex: firstIndex,
        bottomSentinelPreviousY: currentY,
        bottomSentinelPreviousRatio: currentRatio
      });
      // 已经划过的元素使用padding代替
      this.adjustPaddings('top')

    } else { // 交叉 --> 非交叉
      this.updateDomDataCache({
        bottomSentinelPreviousY: currentY,
        bottomSentinelPreviousRatio: currentRatio
      });
    }
  }
  topItemCb(el) {
    // 从非交叉到交叉（true），从交叉到非交叉（false）
    const { topSentinelPreviousY, topSentinelPreviousRatio, currentIndex } = this.domDataCache;

    const currentY = el.boundingClientRect.top;
    const currentRatio = el.intersectionRatio;
    const isIntersecting = el.isIntersecting;
    // console.log(currentY, topSentinelPreviousY)
    // console.log(currentRatio, topSentinelPreviousRatio)
    // console.log(isIntersecting)

    if (
      // 元素进入视窗与离开视窗都会触发回调，而头部元素我们只需监听进入视窗，离开视窗无需监听
      // currentY > topSentinelPreviousY &&
      isIntersecting
      // currentRatio >= topSentinelPreviousRatio
    ) {
      const firstIndex = this.getWindowFirstIndex('down');
      // 向下滑动查看数据，如果到顶了，不做更新
      if (firstIndex === currentIndex) return;
      this.renderFunction(firstIndex);

      this.updateDomDataCache({
        currentIndex: firstIndex,
        topSentinelPreviousY: currentY,
        topSentinelPreviousRatio: currentRatio
      });
      this.adjustPaddings('down');
    } else {
      this.updateDomDataCache({
        topSentinelPreviousY: currentY,
        topSentinelPreviousRatio: currentRatio
      });
    }
  }

  updateDomDataCache(param) {
    Object.assign(this.domDataCache, param)
    // console.log(JSON.parse(JSON.stringify(this.domDataCache)))
  }

  initIntersectionObserver() {
    const options = {};
    // 监听回调
    const callback = (entries) => {
      entries.forEach((ele) => {
        if (ele.target.id === this.firstItemId) {
          // 头部出现或消失在视窗时
          this.topItemCb(ele);
        } else if (ele.target.id === this.lastItemId) {
          // 底部出现或消失在视窗时
          this.bottomItemCb(ele);
        }
      })
    }
    
    // 初始化监听器
    this.io = new IntersectionObserver(callback, options);

    // 观察头部item, 当头部item,开始出现在视窗或从视窗完全离开时，触发callback
    this.io.observe(this.firstItem);
    // 观察底部item, 当底部item,开始出现在视窗或从视窗完全离开时，触发callback
    this.io.observe(this.lastItem);
  }
}