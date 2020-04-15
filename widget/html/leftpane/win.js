// api.lockSlidPane();


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

function openTodoAuthQiye() {
  api.openTabLayout({
    name: 'html/todoauthqiye/win',
    title: '待认证',
    url: 'widget://html/todoauthqiye/win.html',
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
  var userinfo = $api.getStorage('userinfo');
  var name = userinfo.name,
      userType = userinfo.userType;
  $api.byId('name').innerHTML = name;
  $api.byId('version').innerHTML = "\u7248\u672C\u53F7 v".concat(api.appVersion);
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  document.querySelector('#auth').onclick = function () {
    if (userType === '1') {
      openTodoAuthGeren();
    } else {
      openTodoAuthQiye();
    }
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
