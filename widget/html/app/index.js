function openRegLogin() {
  api.openWin({
    name: 'html/reglogin/win',
    url: 'widget://html/reglogin/win.html',
    bgColor: '#fff',
    slidBackEnabled: false
  });
} // 个人登录


function openTodoAuthGeren() {
  api.openTabLayout({
    name: 'html/todoauthgeren/win',
    title: '待认证',
    url: 'widget://html/todoauthgeren/win.html',
    bgColor: '#fff',
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
}

// $api.getStorage()
// $api.rmStorage()
// $api.clearStorage()

apiready = function apiready() {
  // $api.clearStorage()
  if ($api.getStorage('userinfo')) {
    // openTabLayout(3)
    openTodoAuthGeren();
  } else {
    openRegLogin();
  } // 云修复完成


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
