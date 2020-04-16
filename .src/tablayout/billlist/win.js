import '../../app.css'
import './win.css'

import { openBillDetails } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  let pageSize = 20
  let pageNo = 1
  let loading = false

  function getPageData (cb) {
    if (loading) {
      return
    }
    loading = true
    http.post(`/crpt-credit/credit/repay/mybill/billlist`).then(res => {
      loading = false
      api.refreshHeaderLoadDone()
      if (res && res.data.length > 0) {
        pageNo++
        cb(res.data)
      } else if (pageNo === 1) {
        api.toast({ msg: '无数据'})
      } else {
        api.toast({ msg: '无更多数据'})
      }
    }).catch(error => {
      loading = false
      api.refreshHeaderLoadDone()
      api.toast({ msg: '数据加载失败' })
    })
  }

  function appendList (data) {
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li tapmode data-id="${item.orderNo || ''}">
          <div class="t">
            <div class="tit">${item.billDate}账单</div>
            ${item.status === 2 ? '<div class="status warning">未按期还款</div>' : ''}
            <div class="product">${item.productName}</div>
          </div>
          <div class="b">
            <div class="text">
              <strong>应还${item.sumRepayTotalAmount}元</strong>
              <p>
                本金${item.sumRepayPrincipalAmount} + 费用${item.sumServiceFee} + 逾期罚息${item.sumRepayPenaltyAmount}
              </p>
            </div>
            <div class="icon">
                <i class="aui-iconfont aui-icon-right"></i>
            </div>
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

  api.refreshHeaderLoading()

  document.querySelector('#list').onclick = function (event) {
    let li = $api.closest(event.target, 'li')
    if (!li) {
      return
    }
    let id = li.dataset.id
    if (id) {
      openBillDetails(id)
    } else {
      api.toast({ msg: 'id 不存在' })
    }
  }

}
