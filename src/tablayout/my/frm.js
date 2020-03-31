import '../../app.css'
import './frm.css'

// apiready = function () {
//   api.addEventListener({
//     name: 'navitembtn'
//   }, (ret, err) => {
//     alert('点击了'+ret.index+'按钮');
//   })
// }

import { openLeftPane, openMsgCenter, openBillList,
openOrderList, openMyQuota, openMyProduct, openSettings,
openContactUs } from '../../webview.js'

apiready = function () {

  api.addEventListener({
    name: 'swiperight'
  }, function(ret, err){
    openLeftPane()
  });

  document.querySelector('#msgcenter').onclick = function () {
    openMsgCenter()
  }

  document.querySelector('#billlist').onclick = function () {
    openBillList()
  }

  document.querySelector('#orderlist').onclick = function () {
    openOrderList()
  }

  document.querySelector('#myquota').onclick = function () {
    openMyQuota()
  }

  document.querySelector('#myproduct').onclick = function () {
    openMyProduct()
  }

  document.querySelector('#settings').onclick = function () {
    openSettings()
  }

  document.querySelector('#contactus').onclick = function () {
    openContactUs()
  }







}
