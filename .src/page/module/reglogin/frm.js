import '../../../app.css'
import './frm.css'

import {
  openReg, openGerenLogin, openQiyeLogin
} from '../../../webview.js'

class PageController {

  bindEvent () {
    document.querySelector('#register').onclick = function () {
      openReg()
    }
    document.querySelectorAll('.login').forEach(element => {
      element.onclick = function () {
        if (this.dataset.type === 'geren') {
          openGerenLogin()
        } else {
          openQiyeLogin()
        }
      }
    })
  }

}

apiready = function() {
  const ctrl = new PageController()
  ctrl.bindEvent()

}
