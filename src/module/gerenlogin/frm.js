import '../../app.css'
import './frm.css'

import {
  openReg, openGerenLogin, openQiyeLogin,
  openFindPwd, openSendCode, openTabLayout
} from '../../webview.js'

apiready = function() {

  document.querySelector('#forget').onclick = function () {
    openFindPwd()
  }
  document.querySelector('#tel_login').onclick = function () {
    openSendCode()
  }
  document.querySelector('#register').onclick = function () {
    openReg()
  }
  document.querySelector('#login').onclick = function () {
    openTabLayout()
  }

}
