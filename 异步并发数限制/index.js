// http://localhost:3000/user.do 运行express_learn

/*
  实现异步并发限制数量

  Promise.all 思想：

    首先Promise.all发起最大数量的请求，每当其中一个请求成功时，
    判断队列中是否还有task，如果有则在该pirmise.then中返回一新任务，
    此时该promise由于返回新的task，新的promise不是成功状态，即不会终止promise.all
*/


// 模拟ajax
function fn(url) {
  return new Promise((resolve) => {
    fetch('http://localhost:3000/user.do', {
      method: 'post',
      body: JSON.stringify({
        id: url,
      })
    }).then((res) => resolve(res.json()))
  })
}

/**
 * 并发限制
 * @param {*} urls 并发列表队列数据
 * @param {*} limit 最大限制数量
 */
function limitPromise(urls, limit) {
  const tasks = [...urls];

  // 按顺序存储结果
  const resMap = new Map();

  function run() {
    // 队列不空，战斗不止
    if (tasks.length) {
      const task = tasks.shift();
      return fn(task).then((res) => {
        resMap.set(task, res);
        return run();
      })
    }
  }

  const maxTask = Array(Math.min(urls.length, limit)).fill(1).map(() => run());

  return Promise.all(maxTask).then(() => {
    console.log('**')
    return urls.map((item) => resMap.get(item))
  });
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// limitPromise(arr, 3).then((res) => {
//   console.log(res)
// })


function asyncPool(poolLimit, array, iteratorFn) {
  let i = 0;
  const ret = [];
  const executing = [];
  const enqueue = function () {
    // 边界处理，array为空数组
    if (i === array.length) {
        return Promise.resolve();
    }
    // 每调一次enqueue，初始化一个promise
    const item = array[i++];
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    // 放入promises数组
    ret.push(p);
    // promise执行完毕，从executing数组中删除
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    // 插入executing数字，表示正在执行的promise
    executing.push(e);
    // 使用Promise.rece，每当executing数组中promise数量低于poolLimit，就实例化新的promise并执行
    let r = Promise.resolve();
    if (executing.length === poolLimit) {
      r = Promise.race(executing);
    }
    console.log('ret', ret.length)
    console.log('executing', executing.length)
    // 递归，直到遍历完array
    return r.then(() => enqueue());
  };
  return enqueue().then(() => Promise.all(ret));
}

asyncPool(2, arr, fn).then((res) => {
  console.log(res)
})