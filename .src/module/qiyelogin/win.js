import '../../app.css'


apiready = function() {
  api.parseTapmode();
  let header = $api.byId('header')
  $api.fixStatusBar(header)
  let headerPos = $api.offset(header)
  api.openFrame({
    name: 'html/qiyelogin/frm',
    url: 'widget://html/qiyelogin/frm.html',
    bounces: true,
    reload: true,
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
