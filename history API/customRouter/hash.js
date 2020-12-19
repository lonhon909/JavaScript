function getPath() {
  let href = window.location.href;
  const index = href.indexOf('#');
  if (index === -1) return '';
  const hash = window.location.hash.slice(1);
  const searchIndex = href.indexOf('?');
  if (searchIndex === -1) return hash;
  else {
    return hash.slice(0, searchIndex);
  }
}

class HashRouter extends RouterParent {
  constructor(config) {
    super(config);
  }
  init() {
    window.addEventListener('hashchange', this.refresh.bind(this))
    window.addEventListener('load', this.refresh.bind(this))
  }
  refresh() {
    if (this.frontOrBack) {
      this.frontOrBack = false;
    } else {
      this.currentUrl = window.location.hash.slice(1) || '/';
      if (this.replaceRouter) {
        this.replaceRouter = false;
        this.routeHistory[this.currentIndex] = this.currentUrl;
      } else {
        // 当多次back到routeHistory中间时，push路由需要截取掉栈顶部分
        this.currentIndex++;
        this.routeHistory = this.routeHistory.slice(0, this.currentIndex); // 舍弃掉当前索引后的路由历史
        this.routeHistory.push(this.currentUrl);
      }
    }
    const path = getPath();
    let currentComponentName = '';
    let nodeList = document.querySelectorAll('[data-component-name]');
    for (let i = 0; i < this._routes.length; i++) {
      console.log(path, this._routes[i].path)
      const temp = path.split('?').shift();
      if (this._routes[i].path === temp) {
        currentComponentName = this._routes[i].name;
        break;
      }
    }
    console.log(currentComponentName)
    for (let k = 0; k < nodeList.length; k++) {
      if (nodeList[k].dataset.componentName === currentComponentName) {
        console.log(nodeList[k])
        nodeList[k].style.display = 'block';
      } else {
        nodeList[k].style.display = 'none';
      }
    }
  }
  back() {
    if (this.currentIndex > 0) {
      this.frontOrBack = true;
      this.currentIndex--;
      this.currentUrl = this.routeHistory[this.currentIndex];
      window.location.hash = this.currentUrl;
    }
  }
  forward() {
    const length = this.routeHistory.length;
    if (this.currentIndex < length - 1) {
      this.frontOrBack = true;
      this.currentIndex++;
      this.currentUrl = this.routeHistory[this.currentIndex];
      window.location.hash = this.currentUrl;
    }
  }
  go(n) {
    if (!n) return;
    if (n > 0 && n <= this.routeHistory.length - 1 - this.currentIndex) {
      this.currentIndex += n;
      this.currentUrl = this.routeHistory[this.currentIndex];
      this.frontOrBack = true;
      window.location.hash = this.currentUrl;
    } else if (n < 0 && -n <= this.currentIndex) {
      this.currentIndex += n;
      this.currentUrl = this.routeHistory[this.currentIndex];
      this.frontOrBack = true;
      window.location.hash = this.currentUrl;
    }
  }
  push(options) {
    if (options.path) {
      changeHash(options.path, options.query);
    } else {
      let path = '';
      // 没有path就根据name去找path
      for (let i = 0; i < this._routes.length; i++) {
        if (this._routes[i].name === options.name) {
          path = this._routes[i].path;
          break;
        }
      }
      if (!path) {
        error('路由不存在');
      } else {
        changeHash(path, options.query)
      }
    }
  }
  replace(options) {
    this.replaceRouter = true;
    this.push(options);
  }
}

// 报错
function error(message) {
  typeof console !== 'undefined' && console.error(`[html-router] ${message}`);
}

function changeHash(path, query) {
  if (query) {
    let str = '';
    for (let prop in query) {
      str += `&${prop}=${query[prop]}`;
    }
    if (str) {
      window.location.hash = `${path}?${str.slice(1)}`
    } else {
      window.location.hash = path;
    }
  } else {
    window.location.hash = path;
  }
}