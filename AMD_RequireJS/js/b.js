// define(['js/c'], function(c) {
//   const n = c();
//   return n;
// })

// define(function(require) {
//   const c = require('js/c');
//   return c()
// })

define(function(require) {
  let num = 100;
  require('js/c', function(c) {
    num = c();
    console.log(num)
  })
  return num
})