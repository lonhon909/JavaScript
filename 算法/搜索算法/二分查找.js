/* 
这个算法要求在已排序的数组中搜索

1、取得数组的中间值
2、如果选中值为待搜索值，则直接返回
3、如果待搜索值比中间值小，则在中间值左侧的子数组中重新开始步骤1
4、如果待搜索值比中间值大，则在中间值右侧的子数组中重新开始步骤1
*/

const arr = [1, 2, 5, 31, 45, 999, 1119, 2000, 2000, 12345];

function binarySearch(arr, target) {
  let start = 0;
  let end = arr.length - 1;
  let middle;
  while(start <= end) {
    middle = Math.floor((start + end) / 2);
    if (target === arr[middle]) {
      return middle;
    }
    if (target < arr[middle]) {
      end = middle - 1;
    } else {
      start = middle + 1;
    }
  }
  return -1;
}

console.log(binarySearch(arr, 1));
