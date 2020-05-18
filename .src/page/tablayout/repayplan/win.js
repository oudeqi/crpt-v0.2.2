import '../../../app.css'
import './win.css'

// import { openMsgDetails } from '../../../webview.js'
import { http, setRefreshHeaderInfo } from '../../../config.js'
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
    http.get(`/crpt-credit/credit/repay/query/repayplan?pageSize=${pageSize}&pageNo=${pageNo}&orderNo=${id}`).then(res => {
      loading = false
      api.refreshHeaderLoadDone()
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
      api.toast({ msg: '数据加载失败'})
    })
  }

  function appendList (data) {
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li>
          <div class="l">
            <div class="txt1">${item.repayDate ? item.repayDate.split(' ')[0] : ''}</div>
            <span class="txt2">${item.curPeriod}期</span><span class="txt3">${item.status===1?'（未按期还）': ''}</span>
          </div>
          <div class="r">
            <div class="txt1">应还：${numeral(item.repayTotalAmount).format('0,0.00')}</div>
            <div class="txt2">本金：${numeral(item.repayPrincipalAmount).format('0,0.00')}</div>
            <div class="txt2">费用：${numeral(item.serviceFee).format('0,0.00')}</div>
            ${
              item.status===1 ? `<div class="txt3">逾期罚息：${numeral(item.repayPenaltyAmount).format('0,0.00')}</div>` : ''
            }
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
