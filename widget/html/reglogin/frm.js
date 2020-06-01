function openReg() {
  api.openWin({
    name: 'html/register/win',
    url: 'widget://html/register/win.html',
    bgColor: '#fff',
    reload: true
  });
} // 注册登录选择


function openGerenLogin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$userType = _ref.userType,
      userType = _ref$userType === void 0 ? 1 : _ref$userType;

  // 2企业 1个人，
  api.openWin({
    name: 'html/gerenlogin/win',
    url: 'widget://html/gerenlogin/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      userType: userType
    }
  });
} // 企业登录


function openQiyeLogin() {
  api.openWin({
    name: 'html/qiyelogin/win',
    url: 'widget://html/qiyelogin/win.html',
    bgColor: '#fff',
    reload: true
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
