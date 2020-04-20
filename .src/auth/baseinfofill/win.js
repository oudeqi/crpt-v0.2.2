import '../../app.css'

apiready = function() {

  let pageParam = api.pageParam || {}

  let header = $api.byId('header')
  $api.fixStatusBar(header)
  let headerPos = $api.offset(header)
  api.openFrame({
    name: 'html/baseinfofill/frm',
    url: 'widget://html/baseinfofill/frm.html',
    bgColor: '#efefef',
    reload: true,
    bounces: true,
    pageParam,
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
