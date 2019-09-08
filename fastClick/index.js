var node = document.getElementById('container');
var touchstart = document.querySelector('.touchstart');
var touchend = document.querySelector('.touchend');
var clickNode = document.querySelector('.click');
var pmNode = document.getElementById('pm');
var a = 0;
var b = 0;
var c = 0;

node.addEventListener('touchstart', function(e) {
  // e.preventDefault()
  a = Date.now()
  touchstart.innerText = a;
  console.log('touchstart')
})

node.addEventListener('touchmove', function() {
  console.log('touchmove')
})

node.addEventListener('touchend', function() {
  b = Date.now();
  touchend.innerText = b;
  console.log('touchend')
})

node.addEventListener('click', function() {
  c = Date.now();
  clickNode.innerHTML = a - c;
  console.log('click')
  let str = '';
  ['ontouchstart', 'ontouchmove', 'ontouchend', 'onmouseover', 'onmouseenter', 'onmouseleave'].forEach(item => {
    if (item in document) {
      str += `---${item}`
    }
  })
  pmNode.innerText = str
})