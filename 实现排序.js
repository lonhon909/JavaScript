function sort(arr) {
  return divide(arr, 0, arr.length - 1)
}

function divide(nowArray, start, end) {
  if (start >= end) {
      return [ nowArray[start] ];
  }
  let middle = Math.floor((start + end) / 2);
  let left = divide(nowArray, start, middle);
  let right = divide(nowArray, middle + 1, end);
  return merge(left, right)
}

function merge(left, right) {
  let arr = [];
  let pointer = 0, lindex = 0, rindex = 0;
  let l = left.length;
  let r = right.length;
  while (lindex !== l && rindex !== r) {
      if (left[lindex] < right[rindex]) {
          arr.push(left[lindex++])
      } else {
          arr.push(right[rindex++])
      }
  }
  // 说明left有剩余
  if (l !== lindex) {
      while (lindex !== l) {
          arr.push(left[lindex++])
      }
  } else {
      while (rindex !== r) {
          arr.push(right[rindex++])
      }
  }
  return arr;
}

const arr = [0, 1]

console.log(sort(arr))
