import '../../app.css'
import './win.css'

import { openRepayPlan, openRepayRecord } from '../../webview.js'
import { http } from '../../config.js'
import numeral from 'numeral'

apiready = function () {

  let pageParam = api.pageParam || {}
  let { id, type } = pageParam // '9939393'
  if (type !== 'daiZhiFu') {
    $api.byId('title').style.display = 'block'
    $api.byId('plan').style.display = 'block'
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
    // status int 订单状态：
    // 1-未支付 2-处理中 3-逾期 4-已还清 5-过期失效 6-已撤销 7-已退货 8-赊销退货 9-还款中
      let data = res.data || {}
      $api.byId('surplusPrincipalAmount').innerHTML = data.surplusPrincipalAmount ? numeral(data.surplusPrincipalAmount).format('0,0.00') : ''
      $api.byId('orderNo').innerHTML = data.orderNo || ''
      $api.byId('payAmount').innerHTML = data.payAmount ? numeral(data.payAmount).format('0,0.00') : ''
      $api.byId('saleCustName').innerHTML = data.saleCustName || ''
      $api.byId('orderTime').innerHTML = data.orderTime || ''
      $api.byId('appCode').innerHTML = data.appCode === '1' ? 'EBS' : ''
      $api.byId('totalAmount').innerHTML = data.totalAmount || ''
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
    }).catch(error => {
      api.toast({
        msg: error.msg || '请求发生错误'
      })
    })
  }

  getDetails(id)

}
