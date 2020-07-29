import '../../app.css'
import './win.less'

import { openMsgList } from '../../webview.js'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  document.querySelector('#activitylist').onclick = function () {
    openMsgList('账户动态')
  }

  document.querySelector('#noticelist').onclick = function () {
    openMsgList('公告新闻')
  }

}
