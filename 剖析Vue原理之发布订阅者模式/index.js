
new Vue({
  el: '#app',
  data: {
    message: '哈哈哈',
    title: '标题',
    html: '<span>123</span>'
  },
  methods: {
    add() {
      this.message = Math.random();
      console.log(100)
    }
  }
})