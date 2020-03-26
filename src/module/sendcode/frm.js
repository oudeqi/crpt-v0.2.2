import {
  openReg, openGerenLogin, openQiyeLogin,
  openFindPwd, openSendCode, openTabLayout
} from '../../webview.js'

apiready = function() {

  document.querySelector('#login').onclick = function () {
    openTabLayout()
  }

}
