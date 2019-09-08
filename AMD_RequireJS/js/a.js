define(function() {
  return {
    add: function(arr = []) {
      console.log(arr)
      return arr.reduce((initial, current) => {
        return initial + current
      }, 0)
    }
  }
})