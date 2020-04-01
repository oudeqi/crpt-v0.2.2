function openGerenLogin() {
  api.openWin({
    name: 'html/gerenlogin/win',
    url: 'widget://html/gerenlogin/win.html',
    bgColor: '#fff'
  });
} // 企业登录

// $api.getStorage()
// $api.rmStorage()
// $api.clearStorage()

apiready = function apiready() {
  // $api.clearStorage()
  // if ($api.getStorage('userinfo')) {
  //   openDrawer()
  // } else {
  //   openRegLogin()
  // }
  openGerenLogin(); // 云修复完成

  api.addEventListener({
    name: 'smartupdatefinish'
  }, function (ret, err) {
    api.confirm({
      title: '提示',
      msg: '云修复完成，是否需要重启应用？',
      buttons: ['确定', '取消']
    }, function (ret, err) {
      var index = ret.buttonIndex;

      if (index === 1) {
        api.rebootApp();
      }
    });
  }); // 点击启动页面

  api.addEventListener({
    name: 'launchviewclicked'
  }, function (ret, err) {
    api.alert({
      msg: ret.value
    });
  });
};
