import '../../app.css'
import './frm1.css'


import { openOrderDetails } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  document.querySelector('#orderdetails').onclick = function () {
    openOrderDetails()
  }

  function getPageData () {
    // 订单状态：1-未支付 2-支付成功3-支付失败4-退货5-过期失效6-已撤销
    http.get('/crpt-order/order/list/currentuser?pageSize=10&pageNo=1&status=1').then(res => {

    }).catch(error => {

    })
  }



  // getPageData()


}
