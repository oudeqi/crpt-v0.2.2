import '../../app.css'
import './win.css'

// apiready = function () {
//   api.addEventListener({
//     name: 'navitembtn'
//   }, (ret, err) => {
//     alert('点击了'+ret.index+'按钮');
//   })
// }

import { openProductDetails } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  document.querySelector('#productDetails').onclick = function () {
    openProductDetails()
  }

  // document.querySelector('#noticelist').onclick = function () {
  //   openMsgList('公告新闻')
  // }

  function getPageData () {
    http.get('/crpt-cust/product/openinglist/').then(res => {

    }).catch(error => {

    })
  }

  // getPageData()

}
