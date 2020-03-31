import '../../app.css'
import './win.css'

// apiready = function () {
//   api.addEventListener({
//     name: 'navitembtn'
//   }, (ret, err) => {
//     alert('点击了'+ret.index+'按钮');
//   })
// }

import { openMsgList } from '../../webview.js'

apiready = function () {

  document.querySelector('#activitylist').onclick = function () {
    openMsgList('账户动态')
  }

  document.querySelector('#noticelist').onclick = function () {
    openMsgList('公告新闻')
  }

}
