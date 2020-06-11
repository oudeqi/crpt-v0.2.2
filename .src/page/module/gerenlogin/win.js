import '../../../app.css'


apiready = function() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  api.parseTapmode();
  let header = $api.byId('header');
  $api.fixStatusBar(header)
  let headerPos = $api.offset(header)
  //  根据pageParams展示页面导航title，注意，账号密码登录和验证码登录都应拆解成独立的win级模块，解除与个人认证和企业认证的耦合
  let title = $api.byId('g-title')
  const params = api.pageParam || {}
  $api.html(title, params.userType === 2 ? '企业登录' : '个人登录')

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
  })
  document.querySelector('#back').onclick = function () {
    api.closeWin()
  }
}
