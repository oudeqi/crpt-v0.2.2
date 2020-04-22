import '../../app.css'
import './win.css'

import { openMsgDetails } from '../../webview.js'

apiready = function () {

  document.querySelector('#msgdetails').onclick = function () {
    openMsgDetails()
  }

}
