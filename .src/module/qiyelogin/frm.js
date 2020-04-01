import '../../app.css'
import './frm.css'

import {
  openReg, openGerenLogin, openQiyeLogin,
  openFindPwd, openSendCode
} from '../../webview.js'

apiready = function() {

  document.querySelector('#register').onclick = function () {
    openReg()
  }
  document.querySelector('#tel_login').onclick = function () {
    openSendCode()
  }

  // document.querySelectorAll('.login').forEach(element => {
  //   element.onclick = function () {
  //     if (this.dataset.type === 'geren') {
  //       openGerenLogin()
  //     } else {
  //       openQiyeLogin()
  //     }
  //   }
  // })
}
