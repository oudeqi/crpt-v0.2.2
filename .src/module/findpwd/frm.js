import '../../app.css'
import './frm.css'

import { openTabLayout } from '../../webview.js'

apiready = function() {
  api.parseTapmode()
  document.querySelector('#xxx').onclick = function () {
    openTabLayout()
  }
}
