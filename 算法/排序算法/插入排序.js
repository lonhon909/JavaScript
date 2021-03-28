/* 
插入排序思想：
  取得数组第一项作为伪数组，将第二项插入这个伪数组正确位置，接着第三项插入这个伪数组正确位置，... 直到最后一项
*/

const arr = [1, 2, 5, 3, 45, 999, -9, -2, 0, 1];

function insertionSort(arr) {
  let temp;
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    temp = arr[i];
    
    while(j > 0 && arr[j - 1] > temp) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = temp;
  }
  return arr;
}

console.log(insertionSort(arr));
