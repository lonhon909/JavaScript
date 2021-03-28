const arr = [1, 2, 5, 3, 45, 999, -9, -2, 0, 1];

function bubbleSort(arr) {
  // 是否已经排序，用于优化排序
  let isSort = false;
  for (let i = 0; i < arr.length; i++) {
    isSort = true;
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        // 如果有数据交换，则表示当前数组未排序过
        isSort = false;
      }
    }
    // 最好的时间复杂度 O(n)
    if (isSort) {
      // 优化方案：如果去排序一个已经排序好的数组
      break;
    }
  }
  return arr;
}

bubbleSort(arr);

console.log(arr)
