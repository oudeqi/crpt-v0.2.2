import { openRegLogin, openBaseinfoFill, openTodoAuth,
openIDcardUpload, openIDcardInfo } from '../../webview.js'

apiready = function() {

  document.querySelector('#retry').onclick = function () {
    api.closeWin()

  }
}
