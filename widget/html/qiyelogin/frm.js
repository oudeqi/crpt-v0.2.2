function openReg() {
  api.openWin({
    name: 'html/register/win',
    url: 'widget://html/register/win.html',
    bgColor: '#fff'
  });
} // 注册登录选择


function openSendCode() {
  api.openWin({
    name: 'html/sendcode/win',
    url: 'widget://html/sendcode/win.html',
    bgColor: '#fff'
  });
} // 找回密码

apiready = function apiready() {
  document.querySelector('#register').onclick = function () {
    openReg();
  };

  document.querySelector('#tel_login').onclick = function () {
    openSendCode();
  }; // document.querySelectorAll('.login').forEach(element => {
  //   element.onclick = function () {
  //     if (this.dataset.type === 'geren') {
  //       openGerenLogin()
  //     } else {
  //       openQiyeLogin()
  //     }
  //   }
  // })

};
