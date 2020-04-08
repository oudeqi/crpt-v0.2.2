import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload } from '../../webview.js'


apiready = function() {
  api.parseTapmode();
  document.querySelector('#next').onclick = function () {
    openIDcardUpload()
  }
}
