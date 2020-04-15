import '../../app.css'
import './win.css'

import { openRepayPlan, openRepayRecord } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  let pageParam = api.pageParam || {}
  let { id, type } = pageParam // '9939393'
  if (type !== 'daiZhiFu') {
    $api.byId('payDetails').style.display = 'block'
    $api.byId('repayDetails').style.display = 'block'
  }

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
    // orderNo	String	产融APP订单编号
    // payAmount	BigDecimal	支付金额
    // saleCustName	String	购买来源
    // orderTime	Date	创建时间
    // appCode	String	订单来源
    // totalAmount	BigDecimal	订单金额
    // productName	String	(借贷的)产品名称
    // status int 订单状态：1-未支付 2-支付成功3-支付失败4-退货5-过期失效6-已撤销 7-还款中 8-逾期 9-已还清
      let data = res.data || {}
      $api.byId('orderNo').innerHTML = data.orderNo || ''
      $api.byId('payAmount').innerHTML = data.payAmount || ''
      $api.byId('saleCustName').innerHTML = data.saleCustName || ''
      $api.byId('orderTime').innerHTML = data.orderTime || ''
      $api.byId('appCode').innerHTML = data.appCode || ''
      $api.byId('totalAmount').innerHTML = data.totalAmount || ''
      $api.byId('productName').innerHTML = data.productName || ''
      let mapping = {
        1: '未支付',
        2: '支付成功',
        3: '支付失败',
        4: '退货',
        5: '过期失效',
        6: '已撤销',
        7: '还款中',
        8: '逾期',
        9: '已还清',
      }
      $api.byId('status').innerHTML = mapping[data.status] || ''
    }).catch(error => {
      api.toast({
        msg: error.msg || '网络错误'
      })
    })
  }

  getDetails(id)

}
