/* 
选择排序思想：
  原地排序算法。选择排序大致的思路是找到数据结构中的最小值并 将其放置在第一位，
  接着找到第二小的值并将其放在第二位，以此类推
*/
const arr = [1, 2, 5, 3, 45, 999, -9, -2, 0, 1];

function selectionSort(arr) {
  let min = 0;
  for (let i = 0; i < arr.length; i++) {
    min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    if (i !== min) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
    }
  }
  return arr;
}

console.log(selectionSort(arr))
