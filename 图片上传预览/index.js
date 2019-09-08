var inputNode = document.querySelector('.upload-input');
inputNode.addEventListener('change', function(e) {
  console.log(e.target.files)
  previewFile2(e.target.files[0])
})

// 使用 FileReader读取
function previewFile(file) {
  if (!file) return;
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(e) {
    document.getElementById('img').src = e.target.result
  }
}

// 据说性能更好
// 使用 createObjectURL创建 blob:xxx
function previewFile2(file) {
  const src = URL.createObjectURL(file);
  document.getElementById('img').src = src
}