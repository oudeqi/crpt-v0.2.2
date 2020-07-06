import '../../app.css'
import './index.css'

import { openLoanApplication } from '../../webview.js'
import { http, setRefreshHeaderInfo } from '../../config.js'
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

//   业务单状态：1-申请中，2-已审批通过，11-待申请
// (注：前端将后台返回状态为1，2的数据统一为申请中状态并显示)
  const statusMap = {
    1: '申请中',
    2: '申请中',
    11: '待申请',
  }

  function getPageData (cb) {
    if (loading) {
      return
    }
    $api.byId('totalnum').style.display = 'none'
    loading = true
    // 订单状态：1-未支付 2-支付成功3-支付失败4-退货5-过期失效6-已撤销
    http.get(`/crpt-order/order/list/currentuser?status=1&pageSize=${pageSize}&pageNo=${pageNo}`).then(res => {
      loading = false
      api.refreshHeaderLoadDone()
      if (res && res.data.list.length > 0) {
        $api.byId('totalnum').style.display = 'block'
        pageNo++
        $api.byId('total').innerHTML = numeral(res.data.totalAmount || 0).format('0,0.00')
        if (res.data.count) {
          $api.byId('count').innerHTML = res.data.count
        }
        emptyBox.className = emptyBox.className.replace(/\s.showing\s./g, '')
        cb(res.data.list)
      } else if (pageNo === 1) {
        emptyBox.className = `${emptyBox.className} showing`
        api.toast({ msg: '无数据', location: 'middle' })
      } else {
        emptyBox.className = emptyBox.className.replace(/\s.showing\s./g, '')
        api.toast({ msg: '无更多数据', location: 'middle' })
      }
    }).catch(error => {
      loading = false
      api.refreshHeaderLoadDone()
      emptyBox.className = `${emptyBox.className} showing`
      api.toast({ msg: error.msg || '数据加载失败', location: 'middle' })
    })
  }

  function appendList (data) {
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li tapmode data-id="${item.orderNo || ''}">
          <div class="row1">
            <span>${item.orderTime || ''}</span>
            <span>${statusMap[item.status]}</span>
          </div>
          <div class="row2">
            <div class="l">
              <span>待申请金额(元)</span>
              <strong>${numeral(item.payAmount || '').format('0,0.00')}</strong>
            </div>
            ${
              item.status === 1 || item.status === 2
              ? `<div tapmode="active" class="btn" data-id="${item.orderNo || ''}">继续申请</div>`
              : `<div tapmode="active" class="btn" data-id="${item.orderNo || ''}">立即申请</div>`
            }
          </div>
          <div class="row3">
            <div class="l">
              <strong>收款方 ${item.saleCustName || ''}</strong>
              <span>业务单号 ${item.orderNo || ''}</span>
            </div>
            ${
              item.status === 11
              ? `<div tapmode="active" class="txt-btn" data-id="${item.orderNo || ''}">取消</div>`
              : ''
            }
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
    let btn2 = $api.closest(event.target, '.txt-btn')
    if (btn2) {
      api.alert({
        title: '提示',
        msg: '功能开发中...',
      })
    } else if (btn) {
      let id = btn.dataset.id
      if (id) {
        openLoanApplication(id)
      } else {
        api.toast({ msg: 'id 不存在' })
      }
    }
  }

}
