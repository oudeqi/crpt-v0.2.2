import '../../../app.css'
import './frm.css'

import { openOrderTodo } from '../../../webview.js'
import { http, setRefreshHeaderInfo } from '../../../config.js'
import numeral from 'numeral'

apiready = function () {
  let emptyBox = $api.byId('empty-box')

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
          $api.byId('total').innerHTML = numeral(res.data.totalAmount).format('0,0.00')
        }
        if (res.data.count) {
          $api.byId('count').innerHTML = res.data.count
        }
        emptyBox.className = emptyBox.className.replace(/\s.showing\s./g, '')
        cb(res.data.list)
      } else if (pageNo === 1) {
        emptyBox.className = `${emptyBox.className} showing`
        api.toast({ msg: '无数据'})
      } else {
        emptyBox.className = emptyBox.className.replace(/\s.showing\s./g, '')
        api.toast({ msg: '无更多数据'})
      }
    }).catch(error => {
      loading = false
      api.refreshHeaderLoadDone()
      emptyBox.className = `${emptyBox.className} showing`
      api.toast({ msg: '数据加载失败' })
    })
  }

  function appendList (data) {
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li tapmode data-id="${item.orderNo || ''}">
          <div class="row1">
            <span>订单编号</span>
            <span>${item.orderNo || ''}</span>
          </div>
          <div class="row2">
            <span>支付金额(元)</span>
            <strong>${numeral(item.payAmount || '').format('0,0.00')}</strong>
            <div tapmode="active" class="btn" data-id="${item.orderNo || ''}">去支付</div>
          </div>
          <div class="row3">
            购买来源：${item.saleCustName || ''}
          </div>
          <div class="row4">
            <span class="date">下单时间：${item.orderTime || ''}</span>
            <span tapmode="active" class="btn2" data-id="${item.orderNo || ''}">取消订单</span>
          </div>
        </li>
      `)
    })
    api.parseTapmode()
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
    let btn = $api.closest(event.target, '.btn')
    let btn2 = $api.closest(event.target, '.btn2')
    if (btn2) {
      api.alert({
        title: '提示',
        msg: '功能开发中...',
      })
    } else if (btn) {
      let id = btn.dataset.id
      if (id) {
        openOrderTodo(id)
      } else {
        api.toast({ msg: 'id 不存在' })
      }
    }
  }

}
