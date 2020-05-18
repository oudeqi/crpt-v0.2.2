import '../../../app.css'
import './win.css'

import { openRepayPlan, openRepayRecord } from '../../../webview.js'
import { http } from '../../../config.js'
import numeral from 'numeral'

apiready = function () {

  let pageParam = api.pageParam || {}
  let { id, type } = pageParam // '9939393'

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
    // status int 订单状态：
    // 1-未支付 2-处理中 3-逾期 4-已还清 5-过期失效 6-已撤销 7-已退货 8-赊销退货 9-还款中
      let data = res.data || {}
      $api.byId('orderNo').innerHTML = data.orderNo || ''
      $api.byId('payAmount').innerHTML = data.payAmount ? numeral(data.payAmount).format('0,0.00') : ''
      $api.byId('saleCustName').innerHTML = data.saleCustName || ''
      $api.byId('orderTime').innerHTML = data.orderTime || ''
      $api.byId('appCode').innerHTML = data.appCode === '1' ? 'EBS' : ''
      $api.byId('totalAmount').innerHTML = numeral(data.totalAmount).format('0,0.00')
      $api.byId('productName').innerHTML = data.productName || ''
      let mapping = {
        1: '未支付',
        2: '处理中',
        3: '逾期',
        4: '已还清',
        5: '过期失效',
        6: '已撤销',
        7: '已退货',
        8: '赊销退货',
        9: '还款中',
      }
      $api.byId('status').innerHTML = mapping[data.status] || ''
      // 过期失效 -已撤销 ，已退货 ，赊销退货 的订单   不展示 还款计划，支付明细，和还款明细
      // 待支付 也不展示
      if ([1, 2].includes(data.status)) {
        $api.byId('title').style.display = 'none'
        $api.byId('plan').style.display = 'none'
        $api.byId('payDetails').style.display = 'none'
        $api.byId('repayDetails').style.display = 'none'
      }
      if ([5, 6, 7, 8].includes(data.status)) {
        $api.byId('title').style.display = 'block'
        $api.byId('plan').style.display = 'none'
        $api.byId('payDetails').style.display = 'none'
        $api.byId('repayDetails').style.display = 'none'
      }
      if ([3, 4, 9].includes(data.status)) {
        $api.byId('title').style.display = 'block'
        $api.byId('plan').style.display = 'block'
        $api.byId('payDetails').style.display = 'block'
        $api.byId('repayDetails').style.display = 'block'
      }
      if ([5, 6, 7, 8].includes(data.status)) {
        $api.byId('titText').innerHTML = `
          <div>订单金额(元)</div>
          <div>${data.totalAmount ? numeral(data.totalAmount).format('0,0.00') : ''}</div>
        `
      } else {
        $api.byId('titText').innerHTML = `
          <div>剩余未还本金(元)</div>
          <div>${data.surplusPrincipalAmount ? numeral(data.surplusPrincipalAmount).format('0,0.00') : ''}</div>
        `
      }
    }).catch(error => {
      api.toast({
        msg: error.msg || '请求发生错误'
      })
    })
  }

  getDetails(id)

}
