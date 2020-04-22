import '../../app.css'
import './win.css'

import { openMsgList } from '../../webview.js'

apiready = function () {

  document.querySelector('#activitylist').onclick = function () {
    openMsgList('账户动态')
  }

  document.querySelector('#noticelist').onclick = function () {
    openMsgList('公告新闻')
  }

}
