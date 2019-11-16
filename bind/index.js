// 1、返回一个函数
// 2、可以传入参数

Function.prototype.bind2 = function(thisArg, ...context) {
  const self = this;
  if (typeof thisArg === 'string' || typeof thisArg === 'number' || typeof thisArg === 'boolean') {
    thisArg = Object(thisArg)
  }
  return function(...arg) {
    return self.apply(thisArg, context.concat(arg))
  }
}

const a = 1;
function add() {
  console.log(this)
}

const fn = add.bind2(2);

fn()

var foo = {
  value: 1
};

function bar(name, age) {
  console.log(this.value);
  console.log(name);
  console.log(age);

}

var bindFoo = bar.bind2(foo, 'daisy');
bindFoo('18');