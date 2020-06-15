import '../../../app.css'
import './win.css'

import { openBillDetails } from '../../../webview.js'
import { http, setRefreshHeaderInfo } from '../../../config.js'
import numeral from 'numeral'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let loading = false

  function getPageData (cb) {
    if (loading) {
      return
    }
    loading = true
    http.post(`/crpt-credit/credit/repay/mybill/billlist`).then(res => {
      loading = false
      api.refreshHeaderLoadDone()
      if (res && res.data.list.length > 0) {
        cb(res.data.list)
      } else {
        api.toast({ msg: '无数据'})
      }
    }).catch(error => {
      loading = false
      api.refreshHeaderLoadDone()
      api.toast({ msg: error.msg || '数据加载失败' })
    })
  }

  function appendList (data) {
    // 1、正常（页面不做展示）
    // 2、未按期还款
    // 3、今日还款
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li tapmode data-id="${item.orderNo || ''}"
          data-billdate="${item.billDate || ''}"
          data-sumrepaytotalamount="${item.sumRepayTotalAmount || 0}"
          data-sumrepayprincipalamount="${item.sumRepayPrincipalAmount || 0}"
          data-sumserviceFee="${item.sumServiceFee || 0}"
          data-sumrepaypenaltyamount="${item.sumRepayPenaltyAmount || 0}"
          data-sumrepayinterestamount="${item.sumRepayInterestAmount || 0}"
        >
          <div class="t">
            <div class="tit">${item.billDate} 账单</div>
            ${
              item.status === 2
              ? '<div class="status warning">未按期还款</div>'
              : item.status === 3
              ? '<div class="status normal">今日还款</div>'
              : ''
            }
            <div class="product">${item.productName}</div>
          </div>
          <div class="b">
            <div class="text">
              <strong>应还 ${numeral(item.sumRepayTotalAmount).format('0,0.00')}元</strong>
              <p>
                本金${numeral(item.sumRepayPrincipalAmount).format('0,0.00')} + 费用${numeral(item.sumServiceFee).format('0,0.00')} + 逾期罚息${numeral(item.sumRepayPenaltyAmount).format('0,0.00')}
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
    getPageData(function (data) {
      $api.byId('list').innerHTML = ''
      appendList(data)
    })
  }

  setRefreshHeaderInfo(function(ret, err) {
    refresh()
  })

  api.refreshHeaderLoading()

  document.querySelector('#list').onclick = function (event) {
    let li = $api.closest(event.target, 'li')
    if (!li) {
      return
    }
    let id = li.dataset.id
    let billDate = li.dataset.billdate
    let sumRepayTotalAmount = li.dataset.sumrepaytotalamount
    let sumRepayPrincipalAmount = li.dataset.sumrepayprincipalamount
    let sumServiceFee = li.dataset.sumserviceFee
    let sumRepayPenaltyAmount = li.dataset.sumrepaypenaltyamount
    let sumRepayInterestAmount = li.dataset.sumrepayinterestamount
    if (id) {
      openBillDetails(id, {
        billDate,
        sumRepayTotalAmount,
        sumRepayPrincipalAmount,
        sumServiceFee,
        sumRepayPenaltyAmount,
        sumRepayInterestAmount,
      })
    } else {
      api.toast({ msg: 'id 不存在' })
    }
  }

}
