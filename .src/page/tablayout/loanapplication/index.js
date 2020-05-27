import '../../../app.css'
import './index.css'

import { openRepayPlan, openRepayRecord, openLoanConfirm } from '../../../webview.js'
import { http, setRefreshHeaderInfo } from '../../../config.js'
import numeral from 'numeral'

apiready = function () {

  let pageParam = api.pageParam || {}
  let { id } = pageParam // '9939393'

  function getDetails (id) {
    api.showProgress({
      title: '加载中...',
      text: '',
      modal: false
    })
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
      api.hideProgress()
      api.refreshHeaderLoadDone()
      let data = res.data || {}
      $api.byId('orderNo').innerHTML = data.orderNo || ''
      $api.byId('payAmount').innerHTML = numeral(data.payAmount).format('0,0.00')
      $api.byId('saleCustName').innerHTML = data.saleCustName || ''
      $api.byId('orderTime').innerHTML = data.orderTime || ''

    }).catch(error => {
      api.refreshHeaderLoadDone()
      api.hideProgress()
      api.toast({
        msg: error.msg || '请求发生错误'
      })
    })
  }

  setRefreshHeaderInfo(function(ret, err) {
    getDetails(id)
  })

  api.refreshHeaderLoading()

  document.querySelector('#apply').onclick = function (event) {
    openLoanConfirm()
  }
}
