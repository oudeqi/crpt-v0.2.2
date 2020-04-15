apiready = function apiready() {
  api.parseTapmode();
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  var headerPos = $api.offset(header); //  根据pageParams展示页面导航title，注意，账号密码登录和验证码登录都应拆解成独立的win级模块，解除与个人认证和企业认证的耦合

  var title = $api.byId('g-title');
  var params = api.pageParam || {};
  $api.html(title, params.title || '个人登录');
  api.openFrame({
    name: 'html/gerenlogin/frm',
    url: 'widget://html/gerenlogin/frm.html',
    bounces: true,
    reload: true,
    rect: {
      x: 0,
      y: headerPos.h,
      w: 'auto',
      h: 'auto'
    },
    pageParam: params
  });

  document.querySelector('#back').onclick = function () {
    api.closeWin();
  };
};
