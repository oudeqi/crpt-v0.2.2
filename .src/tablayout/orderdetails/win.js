import '../../app.css'
import './win.css'

import { openRepayPlan, openRepayRecord } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  document.querySelector('#repayplan').onclick = function () {
    openRepayPlan('9939393')
  }

  document.querySelector('#repayrecord').onclick = function () {
    openRepayRecord('9939393')
  }

  // function getDetails (id) {
  //   http.get(`/crpt-order/order/detail/app?orderNo=${id}`).then(res => {
  //
  //   }).catch(error => {
  //
  //   })
  // }

  function getDetails (id) {
    http.get(`/crpt-order/order/detail/app?orderNo=${id}`).then(res => {

    }).catch(error => {

    })
  }

  getDetails('9939393')

}
