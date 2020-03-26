import {
  openDrawerLayout,
  openSlidLayout,
  openTabLayout,
  openRegLogin,
  openReg,
  openGerenLogin,
  openQiyeLogin,
  openSendCode,
  openFindPwd
} from '../../webview.js'

apiready = function() {

  openTabLayout()

  document.querySelector('#openDrawerPane').onclick = function () {
    api.openDrawerPane({
      type: 'left'
    });
  }

  document.querySelector('#openSlidPane').onclick = function () {
    api.openSlidPane({
      type: 'left'
    });
  }


}
