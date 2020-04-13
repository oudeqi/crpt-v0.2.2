import '../../app.css'
import './win.css'

import { http } from '../../config.js'

apiready = function () {

  let pageParam = api.pageParam || {}
  let id = pageParam.id // '1103'

  let pageSize = 20
  let pageNo = 1
  let loading = false

  function getPageData (id, cb) {
    if (loading) {
      return
    }
    loading = true
    http.post(`/crpt-credit/credit/repay/mybill/billdetail`, {
      body: {
        orderNo: id
      }
    }).then(res => {
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

  getPageData(id, function (data) {
    $api.byId('list').innerHTML = ''
    appendList(data)
  })

  function appendList (data) {
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li>
          <div class="t">
            <div class="tit">
              <span>应还</span>
              <span>${item.repayTotalAmount}</span>
            </div>
            <div class="msg">
              本金${item.repayPrincipalAmount} + 费用${item.serviceFee}
            </div>
          </div>
          <div class="b">
            <span>${item.repayDate}</span>
            <span>支付2,000元</span>
            <span>第${item.curPeriod}/1${item.repayPeriod}期</span>
          </div>
        </li>
      `)
    })
  }

}
