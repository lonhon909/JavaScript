function d() {
  const blob = new Blob(['Hello World']);
  const url = window.URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = 'hello.txt';
  a.click();
  a.onload = function() {
    console.log('完成');
  }
}