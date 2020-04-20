import '../../app.css'
import './win.css'

import { http } from '../../config.js'
import moment from 'moment'
import numeral from 'numeral'

apiready = function () {
  let pageParam = api.pageParam || {}
  let id = pageParam.id // '1103'
  let loading = false

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
      // console.log('=====---///--------x--')
      // console.log(JSON.stringify(item))
      // <span>支付2,000元</span>
      $api.append($api.byId('list'), `
        <li>
          <div class="t">
            <div class="tit">
              <span>应还</span>
              <span>${numeral(item.repayTotalAmount).format('0,0.00')}</span>
            </div>
            <div class="msg">
              本金 ${item.repayPrincipalAmount} + 费用 ${item.serviceFee}
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
      // console.log(JSON.stringify(moment('2020年1月12日').format('YYYY/M/D')))
      $api.byId('billDate').innerHTML = res.billDate || ''
      $api.byId('sumRepayTotalAmount').innerHTML = res.sumRepayTotalAmount || ''
      $api.byId('sumRepayPrincipalAmount').innerHTML = res.sumRepayPrincipalAmount || ''
      $api.byId('sumServiceFee').innerHTML = res.sumServiceFee || ''
      $api.byId('sumRepayPenaltyAmount').innerHTML = res.sumRepayPenaltyAmount || ''
      $api.byId('bankName').innerHTML = res.bankName || ''
      $api.byId('account').innerHTML = res.account || ''
      let list = res.list
      appendList(list)
    })
  }

  initPageData()

  api.setRefreshHeaderInfo({
    // loadingImg: 'widget://image/refresh.png',
    bgColor: 'rgba(0,0,0,0)',
    textColor: '#bfbfbf',
    textDown: '下拉刷新',
    textUp: '松开刷新',
    textLoading: '加载中...',
    showTime: false
  }, function(ret, err) {
    initPageData()
  })



}
