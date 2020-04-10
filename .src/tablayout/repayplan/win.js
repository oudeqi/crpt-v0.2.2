import '../../app.css'
import './win.css'

// import { openMsgDetails } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  // document.querySelector('#repayplan').onclick = function () {
  //   openMsgDetails()
  // }
  //
  // document.querySelector('#repayplan').onclick = function () {
  //   openMsgDetails()
  // }

  // function getPageData (id) {
  //   http.get(`/crpt-credit/credit/repay/query/repayplan?pageSize=10&pageNo=1&orderNo=${id}`, {
  //     // body: {
  //     //   pageSize: 10,
  //     //   pageNo: 1,
  //     //   orderNo: id
  //     // }
  //   }).then(res => {
  //
  //   }).catch(error => {
  //
  //   })
  // }
  //
  // getPageData('1101')

  let pageSize = 20
  let pageNo = 1
  let loading = false

  let id = '1101'

  function getPageData (cb) {
    if (loading) {
      return
    }
    loading = true
    http.get(`/crpt-credit/credit/repay/query/repayplan?pageSize=10&pageNo=1&orderNo=${id}`).then(res => {
      loading = false
      api.refreshHeaderLoadDone()
      if (res && res.data.list.length > 0) {
        pageNo++
        cb(res.data.list)
      }
    }).catch(error => {
      loading = false
      api.refreshHeaderLoadDone()
      api.toast({ msg: '数据加载失败' })
    })
  }

  function refresh () {
    pageNo = 1
    getPageData(function (data) {
      $api.byId('list').innerHTML = ''
      data.forEach(item => {
        $api.append($api.byId('list'), `
          <li>
            <div class="l">
              <div class="date">${item.repayDate}</div>
              <span>${item.curPeriod}期</span><strong>${item.status===1?'（未按期还）': ''}</strong>
            </div>
            <div class="r">
              <div class="txt1">应还：${item.repayTotalAmount}</div>
              <div class="txt2">本金：${item.repayPrincipalAmount}</div>
              <div class="txt2">费用：${item.serviceFee}</div>
              ${
                item.status===1 ? `<div class="txt3">逾期罚息：${item.repayPenaltyAmount}</div>` : ''
              }
            </div>
          </li>
        `)
      })
    })
  }

  function loadmore () {
    getPageData(function (data) {
      data.forEach(item => {
        // .split(' ')[0]
        $api.append($api.byId('list'), `
          <li>
            <div class="l">
              <div class="date">${item.repayDate}</div>
              <span>${item.curPeriod}期</span><strong>${item.status===1?'（未按期还）': ''}</strong>
            </div>
            <div class="r">
              <div class="txt1">应还：${item.repayTotalAmount}</div>
              <div class="txt2">本金：${item.repayPrincipalAmount}</div>
              <div class="txt2">费用：${item.serviceFee}</div>
              ${
                item.status===1 ? `<div class="txt3">逾期罚息：${item.repayPenaltyAmount}</div>` : ''
              }
            </div>
          </li>
        `)
      })
    })
  }

  api.setRefreshHeaderInfo({
    // loadingImg: 'widget://image/refresh.png',
    bgColor: 'rgba(0,0,0,0)',
    textColor: '#bfbfbf',
    textDown: '下拉刷新',
    textUp: '松开刷新',
    textLoading: '加载中...',
    showTime: false
  }, function(ret, err) {
    refresh()
  })
  api.addEventListener({
    name: 'scrolltobottom',
    extra: {
      threshold: 100 //距离底部距离
    }
  }, function(ret, err) {
    loadmore()
  })

  api.refreshHeaderLoading()

}
