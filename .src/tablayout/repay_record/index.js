import '../../app.css'
import './index.css'

import { http, setRefreshHeaderInfo } from '../../config.js'
import numeral from 'numeral'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let pageSize = 20
  let pageNo = 1
  let loading = false

  let pageParam = api.pageParam || {}
  let orderNo = pageParam.orderNo // '9939393'
  // 9939393
  // 1101

  function getPageData (cb) {
    if (loading) {
      return
    }
    loading = true
    http.get(`/crpt-credit/credit/repay/query/repayrecord?pageSize=${pageSize}&pageNo=${pageNo}&orderNo=${orderNo}`).then(res => {
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
            <span>${item.repayDate ? item.repayDate.split(' ')[0] : ''}</span>
            <span>已还：${numeral(item.curRepaidTotalAmount).format('0,0.00')}</span>
          </div>
          <div class="row2">
            <span>本金</span>
            <span>${numeral(item.curRepaidPrincipalAmount).format('0,0.00')}</span>
          </div>
          <div class="row2">
            <span>费用</span>
            <span>${numeral(item.curServiceFee).format('0,0.00')}</span>
          </div>
          <div class="row2">
            <span>逾期罚息</span>
            <span>${numeral(item.curRepaidPenaltyAmount).format('0,0.00')}</span>
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

  setRefreshHeaderInfo(function(ret, err) {
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
