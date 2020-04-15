import '../../app.css'
import './win.css'

import { openRepayPlan, openRepayRecord } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  let pageParam = api.pageParam || {}
  let { id, type } = pageParam // '9939393'
  // if (type === 'daiZhiFu') {
  //
  // }

  document.querySelector('#repayplan').onclick = function () {
    openRepayPlan(id)
  }

  document.querySelector('#repayrecord').onclick = function () {
    openRepayRecord(id)
  }

  document.querySelector('#agreement').onclick = function () {
    api.alert({
      title: '消息',
      msg: '功能开发中...',
    })
  }

  function getDetails (id) {
    http.get(`/crpt-order/order/detail/app?orderNo=${id}`).then(res => {

    }).catch(error => {
      api.toast({
        msg: error.msg || '网络错误'
      })
    })
  }

  getDetails(id)

}
