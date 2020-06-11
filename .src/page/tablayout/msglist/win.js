import '../../../app.css'
import './win.css'

import { openMsgDetails } from '../../../webview.js'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  document.querySelector('#msgdetails').onclick = function () {
    openMsgDetails()
  }

}
