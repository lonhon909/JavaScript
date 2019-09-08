require.config({
  paths: {
    "a": 'js/a',
    "b": 'js/b'
  }
})

require(['b', 'a'], function(b, a) {
  console.log(a.add([1, 2, 3, 4, b]))
});

// console.log(a)