import '../../app.css'
import './win.css'
// apiready = function () {
//   api.addEventListener({
//     name: 'navitembtn'
//   }, (ret, err) => {
//     alert('点击了'+ret.index+'按钮');
//   })
// }

import { openBillDetails } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  document.querySelector('#billdetails').onclick = function () {
    openBillDetails()
  }


  function getDetails (id) {
    http.post('/crpt-credit/credit/repay/mybill/billdetail', {
      body: {
        orderNo: id
      }
    }).then(res => {

    }).catch(error => {

    })
  }

  function getPageData () {
    http.post('/crpt-credit/credit/repay/mybill/billlist').then(res => {

    }).catch(error => {

    })
  }
  // getPageData()
  // getDetails('1103')

}
