import '../../app.css'
import './frm0.css'


import { openOrderDetails } from '../../webview.js'
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
    // 订单状态：1-未支付 2-支付成功3-支付失败4-退货5-过期失效6-已撤销
    http.get(`/crpt-order/order/list/currentuser?status=1&pageSize=${pageSize}&pageNo=${pageNo}`).then(res => {
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
      api.toast({ msg: '数据加载失败' })
    })
  }

  function appendList (data) {
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li>
          <div class="t">
            <div class="row1">
              <span>订单编号：${item.orderNo}</span>
              <i class="aui-iconfont aui-icon-right"></i>
            </div>
            <div class="row2">
              <span>卖方：</span>
              重庆市永川区旺料销售有限公司
            </div>
            <div class="row2">
              <span>支付时间</span>
              2020/12/12 09/08/02
            </div>
            <div class="row3">
              <span class="label">支付产品</span>
              <strong class="produce">好养贷</strong>
              <span class="status during">还款中</span>
            </div>
          </div>
          <div class="b">
            <div class="tit">
              <span>支付金额（元）</span>
              <span>1,000,00</span>
            </div>
            <div class="msg">
              订单金额：1,000,00，优惠：99.00
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
    openOrderDetails(li.dataset.id)
  }


}
