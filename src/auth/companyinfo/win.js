
import { openRegLogin, openBaseinfoFill, openTodoAuth,
openIDcardUpload } from '../../webview.js'


apiready = function() {
  api.parseTapmode();
  document.querySelector('#next').onclick = function () {
    openIDcardUpload()
  }
}
