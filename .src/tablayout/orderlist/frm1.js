import '../../app.css'
import './frm.css'


import { openOrderDetails } from '../../webview.js'
import { http, setRefreshHeaderInfo } from '../../config.js'
import numeral from 'numeral'

apiready = function () {

  let pageSize = 20
  let pageNo = 1
  let loading = false

  function getPageData (cb) {
    if (loading) {
      return
    }
    loading = true
    // 查询状态： 1-未还清 2-已还清 3-已失效
    http.get(`/crpt-order/order/payInfo?status=2&pageSize=${pageSize}&pageNo=${pageNo}`).then(res => {
      loading = false
      api.refreshHeaderLoadDone()
      if (res && res.data.list.length > 0) {
        pageNo++
        cb(res.data.list)
      } else if (pageNo === 1) {
        // api.toast({ msg: '无数据'})
      } else {
        api.toast({ msg: '无更多数据'})
      }
    }).catch(error => {
      loading = false
      api.refreshHeaderLoadDone()
      api.toast({ msg: error.msg || '数据加载失败' })
    })
  }

  function appendList (data) {
    // 3-逾期 4-已还清  5-过期失效 6-已撤销 7-已退货 8-赊销退货 9-还款中
    let mapping = {
      3: 'warning',
      4: 'repaied',
      5: 'cancel',
      6: 'cancel',
      7: 'cancel',
      8: 'cancel',
      9: 'during',
    }
    let mapping2 = {
      3: '逾期',
      4: '已还清',
      5: '过期失效',
      6: '已撤销',
      7: '已退货',
      8: '赊销退货',
      9: '还款中',
    }
    data.forEach(item => {
      $api.append($api.byId('list'), `
      <li tapmode data-id="${item.orderNo || ''}">
        <div class="t">
          <div class="row1">
            <span>订单编号：${item.orderNo || ''}</span>
            <i class="aui-iconfont aui-icon-right"></i>
          </div>
          <div class="row2">
            <span>卖方</span>
            ${item.saleCustName || ''}
          </div>
          <div class="row2">
            <span>支付时间</span>
            ${item.orderTime || ''}
          </div>
          <div class="row3">
            <span class="label">支付产品</span>
            <strong class="produce">${item.productName || ''}</strong>
            <span class="status ${mapping[item.status]}">${mapping2[item.status] || ''}</span>
          </div>
        </div>
        <div class="b">
          <div class="tit">
            <span>支付金额（元）</span>
            <span>${numeral(item.payAmount).format('0,0.00')}</span>
          </div>
          <div class="msg">
            订单金额：${numeral(item.totalAmount).format('0,0.00')}
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

  document.querySelector('#list').onclick = function (event) {
    let li = $api.closest(event.target, 'li')
    if (!li) {
      return
    }
    let id = li.dataset.id
    if (id) {
      openOrderDetails(id)
    } else {
      api.toast({ msg: 'id 不存在' })
    }
  }


}
