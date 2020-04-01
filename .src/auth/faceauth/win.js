import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill, openTodoAuth,
openIDcardUpload, openIDcardInfo, openFaceUpload } from '../../webview.js'

apiready = function() {

  document.querySelector('#start').onclick = function () {

  }

  document.querySelector('#faceupload').onclick = function () {
    openFaceUpload()
  }

}
