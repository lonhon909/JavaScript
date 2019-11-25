/* 
  字符串填充padStart()和padEnd()

  用法:
    String.padStart(targetLength, padding)
    参数：字符串目标长度和填充字段
*/

let pad = 'hello';
console.log(pad.padStart(10, '-')); // -----hello
console.log(pad.padStart(10, '*')); // *****hello

'Vue'.padEnd(10, '_*')           //'Vue_*_*_*_'
'React'.padEnd(10, 'Hello')      //'ReactHello'
'JavaScript'.padEnd(10, 'Hi')    //'JavaScript'
'JavaScript'.padEnd(8, 'Hi')     //'JavaScript'