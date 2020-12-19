function learn() {
  const xhr = new XMLHttpRequest();
  
  // 设置HTTP请求的时限
  // xhr.timeout = 3000;
  // // timeout事件
  // xhr.ontimeout = function () {
  //   console.log('请求超时');
  // }
  
  // FormData对象
  // const formData = new FormData();
  // formData.append('name', '张涵');
  // formData.append('age', 21);
  
  xhr.open('GET', 'http://172.20.58.59:3000/download');
  
  // xhr.responseType = 'arraybuffer';
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(null);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(JSON.parse(xhr.responseText))
    }
  }

  xhr.abort = function() {
    console.log('终止请求');
  }

  
  // 进度信息，下载的progress事件属于XMLHttpRequest对象，上传的progress事件属于XMLHttpRequest.upload对象
  // 下载进度
  xhr.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = event.loaded / event.total;
      console.log(percentComplete);
    }
  }
  
  // 上传进度
  // xhr.upload.onprogress = function(event) {
  //   if (event.lengthComputable) {
  //     const percentComplete = event.loaded / event.total;
  //     console.log(percentComplete);
  //   }
  // }
}
