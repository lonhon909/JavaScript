/* 
  该方法会返回目标对象中所有属性的属性描述符，该属性必须是对象自己定义的，不能是从原型链继承来的。
*/

var obj = {
  id: 1,
  name: '霖呆呆',
  get gender() {
    console.log('gender')
  },
  set grad(d) {
    console.log(d)
  }
}
console.log(Object.getOwnPropertyDescriptors(obj))

// 第二个参数,用于指定属性的属性描述符
Object.getOwnPropertyDescriptors(obj, 'id')
//输出结果应该为
// {
//   id: {
//     configurable: true,
//     enumerable: true,
//     value: 1,
//     writable: true
//   }
// }