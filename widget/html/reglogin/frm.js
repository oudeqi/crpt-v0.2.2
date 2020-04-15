// api.lockSlidPane();


function openReg() {
  api.openWin({
    name: 'html/register/win',
    url: 'widget://html/register/win.html',
    bgColor: '#fff'
  });
} // 注册登录选择


function openGerenLogin() {
  api.openWin({
    name: 'html/gerenlogin/win',
    url: 'widget://html/gerenlogin/win.html',
    bgColor: '#fff'
  });
} // 企业登录


function openQiyeLogin() {
  api.openWin({
    name: 'html/qiyelogin/win',
    url: 'widget://html/qiyelogin/win.html',
    bgColor: '#fff'
  });
} // 电话号码登录

apiready = function apiready() {
  document.querySelector('#register').onclick = function () {
    openReg();
  };

  document.querySelectorAll('.login').forEach(function (element) {
    element.onclick = function () {
      if (this.dataset.type === 'geren') {
        openGerenLogin();
      } else {
        openQiyeLogin();
      }
    };
  });
};
