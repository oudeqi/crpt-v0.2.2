function openRegLogin() {
  api.openWin({
    name: 'html/reglogin/win',
    url: 'widget://html/reglogin/win.html',
    bgColor: '#fff',
    slidBackEnabled: false
  });
} // 个人登录


function openChangePwd() {
  api.openTabLayout({
    name: 'html/changepwd/win',
    title: '修改密码',
    url: 'widget://html/changepwd/win.html',
    bgColor: '#fff',
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 联系我们

// apiready = function () {

apiready = function apiready() {
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

  document.querySelector('#changepwd').onclick = function () {
    openChangePwd();
  };
};
