import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill, openTodoAuth,
openIDcardUpload, openIDcardInfo, openTabLayout } from '../../webview.js'

apiready = function() {

  document.querySelector('#goIndex').onclick = function () {
    openTabLayout()
  }

}
