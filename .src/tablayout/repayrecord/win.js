import '../../app.css'
import './win.css'

// import { openMsgDetails } from '../../webview.js'

import { http } from '../../config.js'

apiready = function () {

  // document.querySelector('#repayplan').onclick = function () {
  //   openMsgDetails()
  // }
  //
  // document.querySelector('#repayplan').onclick = function () {
  //   openMsgDetails()
  // }

  function getPageData (id) {
    http.get(`/credit/repay/query/repayrecord?pageSize=10&pageNo=1&orderNo=${id}`, {
      // body: {
      //   pageSize: 10,
      //   pageNo: 1,
      //   orderNo: id
      // }
    }).then(res => {

    }).catch(error => {

    })
  }

  getPageData('9939393')
}
