apiready = function apiready() {
  api.parseTapmode();

  document.querySelector('#agreement').onclick = function () {
    api.alert({
      title: '消息',
      msg: '功能开发中...'
    }, function (ret, error) {});
  };
};
