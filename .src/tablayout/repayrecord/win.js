import '../../app.css'
import './win.css'

// import { openMsgDetails } from '../../webview.js'

import { http } from '../../config.js'
import numeral from 'numeral'

apiready = function () {

  let pageSize = 20
  let pageNo = 1
  let loading = false

  let pageParam = api.pageParam || {}
  let id = pageParam.id // '9939393'
  // 9939393
  // 1101

  function getPageData (cb) {
    if (loading) {
      return
    }
    loading = true
    http.get(`/crpt-credit/credit/repay/query/repayrecord?pageSize=${pageSize}&pageNo=${pageNo}&orderNo=${id}`).then(res => {
      loading = false
      api.refreshHeaderLoadDone()
      $api.byId('total').innerHTML = numeral(res.data.sumRepaidTotalAmount).format('0,0.00')
      if (res && res.data.list.length > 0) {
        pageNo++
        cb(res.data.list)
      } else if (pageNo === 1) {
        api.toast({ msg: '无数据'})
      } else {
        api.toast({ msg: '无更多数据'})
      }
    }).catch(error => {
      loading = false
      api.refreshHeaderLoadDone()
      api.toast({ msg: error.msg })
    })
  }

  function appendList (data) {
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li>
          <div class="row1">
            <span>${item.repaidDate ? item.repaidDate.split(' ')[0] : ''}</span>
            <span>已还：${item.curRepaidTotalAmount}</span>
          </div>
          <div class="row2">
            <span>本金</span>
            <span>${item.curRepaidPrincipalAmount}</span>
          </div>
          <div class="row2">
            <span>费用</span>
            <span>${item.curServiceFee}</span>
          </div>
          <div class="row2">
            <span>逾期罚息</span>
            <span>${item.curRepaidPenaltyAmount}</span>
          </div>
        </li>
      `)
    })
  }

  function refresh () {
    pageNo = 1
    getPageData(function (data) {
      $api.byId('list').innerHTML = ''
      appendList(data)
    })
  }

  function loadmore () {
    getPageData(function (data) {
      appendList(data)
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
