import '../../app.css'
import './frm.css'

import { openLeftPane, openOrderDetails } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  api.addEventListener({
    name: 'swiperight'
  }, function(ret, err){
    openLeftPane()
  })

  api.addEventListener({
    name: 'keyback'
  }, function(ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })

  let pageSize = 20
  let pageNo = 1
  let loading = false

  function getPageData (cb) {
    if (loading) {
      return
    }
    loading = true
    // 订单状态：1-未支付 2-支付成功3-支付失败4-退货5-过期失效6-已撤销
    http.get(`/crpt-order/order/list/currentuser?status=1&pageSize=${pageSize}&pageNo=${pageNo}`).then(res => {
      loading = false
      api.refreshHeaderLoadDone()
      if (res && res.data.list.length > 0) {
        pageNo++
        if (res.data.totalAmount) {
          $api.byId('total').innerHTML = res.data.totalAmount
        }
        if (res.data.count) {
          $api.byId('count').innerHTML = res.data.count
        }
        cb(res.data.list)
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
        <li data-id="${item.orderNo || ''}">
          <div class="row1">
            <span>订单编号</span>
            <span>${item.orderNo || ''}</span>
          </div>
          <div class="row2">
            <span>支付金额(元)</span>
            <strong>${item.payAmount || ''}</strong>
            <div class="btn">去支付</div>
          </div>
          <div class="row3">
            购买来源：${item.saleCustName || ''}
          </div>
          <div class="row4">
            <span class="date">下单时间：${item.orderTime || ''}</span>
            <span class="btn">取消订单</span>
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

  document.querySelector('#list').onclick = function (event) {
    let li = $api.closest(event.target, 'li')
    if (!li) {
      return
    }
    let id = li.dataset.id
    if (id) {
      openOrderDetails(id, 'daiZhiFu')
    } else {
      api.toast({ msg: 'id 不存在' })
    }
  }

}
