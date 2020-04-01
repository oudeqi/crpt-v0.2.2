import '../../app.css'

apiready = function() {
  api.parseTapmode();
  let header = $api.byId('header')
  $api.fixStatusBar(header)
  let headerPos = $api.offset(header)
  api.openFrame({
    name: 'html/reglogin/frm',
    url: 'widget://html/reglogin/frm.html',
    bounces: true,
    rect: {
      x: 0,
      y: headerPos.h,
      w: 'auto',
      h: 'auto'
    }
  })
}