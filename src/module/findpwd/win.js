import { closeWin } from '../../webview.js'

apiready = function() {
  api.parseTapmode()
  let header = $api.byId('header')
  $api.fixStatusBar(header)
  let headerPos = $api.offset(header)
  api.openFrame({
    name: 'html/findpwd/frm',
    url: 'widget://html/findpwd/frm.html',
    bounces: true,
    rect: {
      x: 0,
      y: headerPos.h,
      w: 'auto',
      h: 'auto'
    }
  })
  document.querySelector('#back').onclick = function () {
    closeWin()
  }
}
