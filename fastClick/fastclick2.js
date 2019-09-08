class FastClick {
  /**
   * 
   * @param {*} layer 监听的层
   * @param {*} options 默认设置
   */
  constructor(layer, options = {}) {
    let oldOnClick = null;
    this.layer = layer;
    /**
     * @type boolean 当前是否在跟踪点击
     */
    this.trackingClick = false;
    /**
     * @type number 跟踪点击开始时间戳
     */
    this.trackingClickStart = 0;
    /**
		 * @type EventTarget 监听点击事件的元素
		 */
    this.targetElement = null;
    /**
		 * @type number touch事件的x坐标
		 */
    this.touchStartX = 0;
    /**
		 * @type number touch事件的y坐标
		 */
    this.touchStartY = 0;
    // 最后一次触摸事件的id
    this.lastTouchIdentifier = 0;
    // 触摸移动边界，超过该边界将取消点击。
    this.touchBoundary = options.touchBoundary || 10;
    /**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
    this.tapDelay = options.tapDelay || 200;
    /**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
    this.tapTimeout = options.tapTimeout || 700;

    if (FastClick.notNeeded(layer)) {
			return;
		}
    
    ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'].forEach(fn => this[fn].bind(this))

    // Set up event handlers as required
		if (FastClick.deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
    }
    
    layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);
    
    if (typeof layer.onclick === 'function') {
  
      // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
      // - the old one won't work if passed to addEventListener directly.
      oldOnClick = layer.onclick;
      layer.addEventListener('click', function(event) {
        oldOnClick(event);
      }, false);
      layer.onclick = null;
    }
  }

}

FastClick.deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
FastClick.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !FastClick.deviceIsWindowsPhone;
FastClick.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !FastClick.deviceIsWindowsPhone;
FastClick.deviceIsIOS4 = FastClick.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);
FastClick.deviceIsIOSWithBadTarget = FastClick.deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);
FastClick.deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;
FastClick.notNeeded = function(layer) {
  let metaViewport;
  let chromeVersion;
  let blackberryVersion;
  let firefoxVersion;
  // Devices that don't support touch don't need FastClick
  if (typeof window.ontouchstart === 'undefined') {
    return true;
  }

  // Chrome version - zero for other browsers
  chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

  if (chromeVersion) {
    if (FastClick.deviceIsAndroid) {
      metaViewport = document.querySelector('meta[name=viewport]');
      if (metaViewport) {
        // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
        if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
          return true;
        }

        // Chrome 32 and above with width=device-width or less don't need FastClick
        if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
  if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
    return true;
  }

  // Firefox version - zero for other browsers
  firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

  if (firefoxVersion >= 27) {
    // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

    metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
      return true;
    }
  }

  // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
  // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
  if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
    return true;
  }

  return false;
}
