function openRegLogin() {
  api.openWin({
    name: 'html/reglogin/win',
    url: 'widget://html/reglogin/win.html',
    bgColor: '#fff',
    slidBackEnabled: false
  });
} // 个人登录


function openTodoAuth() {
  api.openTabLayout({
    name: 'html/todoauth/win',
    title: '待认证',
    url: 'widget://html/todoauth/win.html',
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
} // 企业信息确认

apiready = function apiready() {
  api.parseTapmode();
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  document.querySelector('#auth').onclick = function () {
    openTodoAuth();
  };

  document.querySelector('#logout').onclick = function () {
    api.confirm({
      title: '提示',
      msg: '确定要退出登录吗？',
      buttons: ['确定', '取消']
    }, function (ret, err) {
      if (ret.buttonIndex === 1) {
        openRegLogin();
        $api.clearStorage();
      }
    });
  };

  document.querySelector('#close').onclick = function () {
    api.closeWin();
  };

  api.addEventListener({
    name: 'swipeleft'
  }, function (ret, err) {
    api.closeWin();
  });
};
