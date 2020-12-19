class HistoryRouter extends RouterParent {
  constructor(config) {
    super(config);
  }
  init() {
    window.addEventListener('popstate', this.refresh.bind(this))
    window.addEventListener('load', this.refresh.bind(this))
  }

  refresh() {
    let path = window.location.pathname,
        currentComponentName = '',
        nodeList = document.querySelectorAll('[data-component-name]');
    // 找出当前路由的名称
    for (let i = 0; i < this._routes.length; i++) {
      if (this._routes[i].path === path) {
        currentComponentName = this._routes[i].name;
        break;
      }
    }
    // 根据当前路由的名称显示对应的组件
    nodeList.forEach(item => {
      if (item.dataset.componentName === currentComponentName) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  go(n) {
    window.history.go(n)
  }
  push(options) {
    if (options.path) {
      pushHistory.call(this, options.path, options.query, this.replaceRouter);
    } else if (options.name) {
      let routePath = '';
      // 根据路由名称找路由path
      for (let i = 0; i < this._routes.length; i++) {
        if (this._routes[i].name === options.name) {
          routePath = this._routes[i].path;
          break;
        }
      }
      if (!routePath) {
        error('组件名称不存在');
      } else {
        pushHistory.call(this, routePath, options.query, this.replaceRouter);
      }
    }
  }
  replace(options) {
    // 表示当前处于replace
    this.replaceRouter = true;
    this.push(options);
  } 
}

function pushHistory(routePath, query, replace) {
  let path = getTargetPath(routePath, query);
  if (path !== window.location.pathname) {
    if (replace) {
      window.history.replaceState(path, '', path);
      this.replaceRouter = false;
    } else {
      window.history.pushState(path, '', path);
    }
    this.refresh();
  }
}

function getTargetPath(path, query) {
  if (!query) return path;
  let str = '';
  for (let prop in query) {
    str += `&${prop}=${query[prop]}`;
  }
  if (str) {
    return `${path}?${str.slice(1)}`
  }
  return path;
}

function error(message) {
  typeof console !== 'undefined' && console.error(`[html-router] ${message}`);
}
