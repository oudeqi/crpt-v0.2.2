import '../../app.css'
import './index.css'

import { openRepayPlan, openRepayRecord } from '../../webview.js'
import { http } from '../../config.js'
import numeral from 'numeral'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
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
      const appcodeMap = {
        1: 'EBS',
        2: '客户',
        3: '产融',
      }
      let data = res.data || {}
      $api.byId('orderNo').innerHTML = data.orderNo || ''
      $api.byId('payAmount').innerHTML = data.payAmount ? numeral(data.payAmount).format('0,0.00') : ''
      $api.byId('saleCustName').innerHTML = data.saleCustName || ''
      $api.byId('orderTime').innerHTML = data.orderTime || ''
      $api.byId('appCode').innerHTML = appcodeMap[data.appCode]
      $api.byId('totalAmount').innerHTML = numeral(data.totalAmount).format('0,0.00')
      $api.byId('productName').innerHTML = data.productName || ''
      // 业务单状态：
      // 1-申请中,2-已审批通过,3-已拒绝,4-已撤销,5-还款中,6-到期结清,7-提前结清,
      // 8-逾期还款中,9-逾期已结清,10-已退货 11-待申请 12-已取消
      let mapping = {
        1: '申请中',
        2: '已审批通过',
        3: '已拒绝',
        4: '已撤销',
        5: '还款中',
        6: '到期结清',
        7: '提前结清',
        8: '逾期还款中',
        9: '逾期已结清',
        10: '已退货',
        11: '待申请',
        12: '已取消',
      }
      let statusMapping = {
        3: 'refused',
        4: 'cancel',
        5: 'repaying',
        6: 'normalOver',
        7: 'earlyOver',
        8: 'overdue',
        9: 'overdueOver',
        10: 'back',
      }
      $api.byId('status').innerHTML = mapping[data.status] || ''
      $api.byId('status').classList.add(statusMapping[data.status] || '')
      // 过期失效 -已撤销 ，已退货 ，赊销退货 的订单   不展示 还款计划，支付明细，和还款明细
      // 待支付 也不展示
      // 1-未支付 2-处理中 3-逾期 4-已还清 5-过期失效 6-已撤销 7-已退货 8-赊销退货 9-还款中
      if ([1, 2, 3, 4, 10, 11, 12].includes(data.status)) {
        $api.byId('title').style.display = 'block'
      }
      if ([5, 6, 7, 8, 9].includes(data.status)) {
        $api.byId('title').style.display = 'block'
        $api.byId('plan').style.display = 'block'
        $api.byId('payDetails').style.display = 'block'
        $api.byId('repayDetails').style.display = 'block'
      }

      if ([1, 2, 3, 4, 6, 7, 9, 10, 11, 12].includes(data.status)) {
        $api.byId('titText').innerHTML = `
          <div class="amount">订单金额(元)</div>
          <div class="num">${data.totalAmount ? numeral(data.totalAmount).format('0,0.00') : ''}</div>
        `
      } else {
        $api.byId('titText').innerHTML = `
          <div class="amount">剩余未还本金(元)</div>
          <div class="num">${data.surplusPrincipalAmount ? numeral(data.surplusPrincipalAmount).format('0,0.00') : ''}</div>
        `
      }
    }).catch(error => {
      api.toast({
        msg: error.msg || '请求发生错误'
      })
    })
  }

  // getDetails(id)

}
