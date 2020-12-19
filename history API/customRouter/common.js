class RouterParent {
  constructor(config) {
    this._routes = config.routes;
    this.routeHistory = [];
    this.currentUrl = '';
    this.currentIndex = -1;
    this.frontOrBack = false; // 是否的点击前进后退造成的路由变化，此时不需要监听到路由变化函数
    this.replaceRouter = false; // 是否是替换当前路由
  }
}
