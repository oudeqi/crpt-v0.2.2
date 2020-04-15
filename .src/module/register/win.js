import '../../app.css'

apiready = function() {
  api.parseTapmode()
  let header = $api.byId('header')
  $api.fixStatusBar(header)
  let headerPos = $api.offset(header)
  api.openFrame({
    name: 'html/register/frm',
    url: 'widget://html/register/frm.html',
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
