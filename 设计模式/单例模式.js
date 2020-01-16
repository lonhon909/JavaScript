// 保证一个类仅有一个实例，并提供一个访问它的全局访问点。

// const Card = (function() {
//   let instance = null;
//   return function Card(money) {
//     if (!(this instanceof Card)) throw("请通过new调用")
//     // 如果已经实例化过，直接返回
//     if (instance) return instance;
//     this.money = money;
//     // 存储该实例
//     instance = this;
//   }
// })()

// Card.prototype.getMoney = function() {
//   return this.money
// }

// const card1 = new Card(100);
// console.log(card1.getMoney()); // 100

// const card2 = new Card(200);
// console.log(card2.getMoney()); // 100，任然是100，因为new返回了第一次的实例

// console.log(card1 === card2); // true


// 通用方法
/**
 * 
 * @param {*} fn 将构造函数传入
 * @return {*} 返回构造函数的实例
 */
const usualSingletonPattern = function(fn) {
  // 如果传入的不是函数
  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    throw('请传入构造函数')
  }
  let instance = null;
  return function usualSingletonPattern(...rest) {
    if (!(this instanceof usualSingletonPattern)) {
      throw('请通过new调用')
    }
    return instance || (instance = new fn(...rest))
  }
}

const Barber = function(money){
  this.money = money;
}
Barber.prototype.getMoney = function(){
  console.log(this.money);
}
const SuperBarber = usualSingletonPattern(Barber);

const card = new SuperBarber(500);
const card2 = new SuperBarber(500);
card.getMoney(); //500
card2.getMoney(); //500
console.log(card === card2); //true
