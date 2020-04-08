function closeWin() {
  api.closeWin({});
}

apiready = function apiready() {
  var pageParam = api.pageParam || {};
  var loginType = pageParam.loginType;

  if (loginType === 'geren') {
    $api.byId('title').innerHTML = '个人登录';
  } else {
    $api.byId('title').innerHTML = '企业登录';
  }

  var header = $api.byId('header');
  $api.fixStatusBar(header);
  var headerPos = $api.offset(header);
  api.openFrame({
    name: 'html/sendcode/frm',
    url: 'widget://html/sendcode/frm.html',
    bounces: true,
    pageParam: api.pageParam,
    rect: {
      x: 0,
      y: headerPos.h,
      w: 'auto',
      h: 'auto'
    }
  });

  document.querySelector('#back').onclick = function () {
    closeWin();
  };
};
