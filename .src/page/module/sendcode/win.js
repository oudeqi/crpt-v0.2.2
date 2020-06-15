import '../../../app.css'

apiready = function() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let pageParam = api.pageParam || {}
  let { userType } = pageParam
  if (userType === 1) {
    $api.byId('title').innerHTML = '个人登录'
  } else {
    $api.byId('title').innerHTML = '企业登录'
  }
  let header = $api.byId('header')
  $api.fixStatusBar(header)
  let headerPos = $api.offset(header)
  api.openFrame({
    name: 'html/sendcode/frm',
    url: 'widget://html/sendcode/frm.html',
    bounces: true,
    reload: true,
    pageParam: api.pageParam,
    rect: {
      x: 0,
      y: headerPos.h,
      w: 'auto',
      h: 'auto'
    }
  })
  document.querySelector('#back').onclick = function () {
    api.closeWin()
  }
}
