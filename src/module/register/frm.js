
apiready = function() {
  api.parseTapmode();
  document.querySelector('#agreement').onclick = function () {
    api.alert({
      title: '消息',
      msg: '功能开发中...',
    }, (ret, error) => {
      
    });
  }
}
