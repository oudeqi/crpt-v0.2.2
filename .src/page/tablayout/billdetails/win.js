import '../../../app.css'
import './win.css'

import { http, setRefreshHeaderInfo } from '../../../config.js'
import moment from 'moment'
import numeral from 'numeral'

apiready = function () {
  let pageParam = api.pageParam || {}
  let {
    id, // '1103'
    billDate,
    sumRepayTotalAmount,
    sumRepayPrincipalAmount,
    sumServiceFee,
    sumRepayPenaltyAmount,
    sumRepayInterestAmount,
  } = pageParam
  let loading = false

  // console.log(JSON.stringify(moment('2020年1月12日').format('YYYY/M/D')))
  $api.byId('billDate').innerHTML = billDate || ''
  $api.byId('sumRepayTotalAmount').innerHTML = numeral(sumRepayTotalAmount).format('0,0.00')
  $api.byId('sumRepayPrincipalAmount').innerHTML = numeral(sumRepayPrincipalAmount).format('0,0.00')
  $api.byId('sumServiceFee').innerHTML = numeral(sumServiceFee).format('0,0.00')
  $api.byId('sumRepayPenaltyAmount').innerHTML = numeral(sumRepayPenaltyAmount).format('0,0.00')
  $api.byId('sumRepayInterestAmount').innerHTML = numeral(sumRepayInterestAmount).format('0,0.00')

  function getPageData (id, cb) {
    if (loading) {
      return
    }
    api.showProgress({
      title: '加载中...',
      text: '',
      modal: false
    })
    loading = true
    http.post(`/crpt-credit/credit/repay/mybill/billdetail`, {
      body: {
        orderNo: id
      }
    }).then(res => {
      loading = false
      api.hideProgress()
      api.refreshHeaderLoadDone()
      cb(res.data)
    }).catch(error => {
      loading = false
      api.hideProgress()
      api.refreshHeaderLoadDone()
      api.toast({ msg: error.msg || '数据加载失败' })
    })
  }


  function appendList (data) {
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li>
          <div class="t">
            <div class="tit">
              <span>应还</span>
              <span>${numeral(item.repayTotalAmount).format('0,0.00')}</span>
            </div>
            <div class="msg">
              <span>利息：${numeral(item.repayInterestAmount).format('0,0.00')}</span>
              <span>本金 ${numeral(item.repayPrincipalAmount).format('0,0.00')} + 费用 ${numeral(item.serviceFee).format('0,0.00')}</span>
            </div>
          </div>
          <div class="b">
            <span>${item.repayDate}</span>
            <span>第${item.curPeriod}/${item.repayPeriod}期</span>
          </div>
        </li>
      `)
    })
    api.parseTapmode()
  }

  function initPageData() {
    getPageData(id, function (res) {
      $api.byId('bankName').innerHTML = res.bankName || ''
      $api.byId('account').innerHTML = res.account || ''
      let list = res.list
      $api.byId('list').innerHTML = ''
      appendList(list)
    })
  }

  initPageData()

  setRefreshHeaderInfo(function(ret, err) {
    initPageData()
  })



}
