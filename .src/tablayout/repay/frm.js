import '../../app.css'
import './frm.css'

import { openLeftPane } from '../../webview.js'
import { http } from '../../config.js'
import moment from 'moment'

apiready = function () {

  let now = null
  let loading = false

  api.addEventListener({
    name: 'keyback'
  }, function(ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })

  function renderMonth () {
    let month = parseInt(now.format('M'))
    let tit = now.format('YYYY年M月')
    $api.byId('tit').innerHTML = tit
    $api.dom($api.byId('prev'), 'span').innerHTML = month === 1 ? '12月' : (month - 1 + '月')
    $api.dom($api.byId('next'), 'span').innerHTML = month === 12 ? '1月' : (month + 1 + '月')
  }

  function initPage () {
    now = moment()
    renderMonth()
    getPageData()
  }

  initPage()

  document.querySelector('#prev').onclick = function () {
    if (loading) {
      return
    }
    loading = true
    now.subtract(1, 'months')
    renderMonth()
    getPageData()
  }

  document.querySelector('#next').onclick = function () {
    if (loading) {
      return
    }
    loading = true
    now.add(1, 'months')
    renderMonth()
    getPageData()
  }

  api.addEventListener({
    name: 'swiperight'
  }, function(ret, err){
    openLeftPane()
  })

  api.setRefreshHeaderInfo({
    // loadingImg: 'widget://image/refresh.png',
    bgColor: 'rgba(0,0,0,0)',
    textColor: '#bfbfbf',
    textDown: '下拉刷新',
    textUp: '松开刷新',
    textLoading: '加载中...',
    showTime: false
  }, function(ret, err) {
    // setTimeout(() => {
    //   api.refreshHeaderLoadDone();
    // }, 1000)
    initPage()
  })
  api.refreshHeaderLoading()

  function appendList (data) {
    if (data.length > 0) {
      $api.byId('nodata').style.display = 'none'
    }
    $api.byId('list').innerHTML = ''
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li>
          <div class="row1">
            <span class="name">${item.productName}</span>
            ${
              item.status === '4' ? `<span class="warning">未按期还款</span>` : ''
            }
            <span class="data ${item.status === '4' ? 'red' : ''}">还款日 ${item.repayDate}</span>
          </div>
          <div class="row2">
            <div class="txt"><div><strong>${item.repayAmount}</strong><span>(含服务费${item.serviceFee})</span></div>
            <i>${item.curPeriod}/${item.repayPeriod}期</i>
            </div>
            <div class="btn">还款</div>
          </div>
        </li>
      `)
    })
  }
  function appendTotal (data) {
    $api.byId('total').innerHTML = `
      <p>剩余待还(元)</p>
      <p><strong>${data.remainderRepayAmount || '无'}</strong></p>
      ${
        data.remainderRepayAmount ? `<p>最近还款日期 <span>${data.latestRepayDate || '无'}</span></p>` : ''
      }
    `
  }

  function getPageData () {
    $api.byId('total').innerHTML = '<div class="loading">加载中...</div>'
    http.get(`/crpt-credit/credit/repay/pending/list?queryDate=${now.format('YYYYMM')}`).then(res => {
      loading = false
      api.refreshHeaderLoadDone()
      let data = res.data || {}
      appendTotal(data)
      appendList(data.list || [])
    }).catch(error => {
      loading = false
      api.refreshHeaderLoadDone()
      api.toast({
        msg: error.msg || '获取数据失败'
      })
    })
  }

  // function getDetails (id) {
  //   http.get(`/crpt-order/order/detail/app?orderNo=${id}`).then(res => {
  //
  //   }).catch(error => {
  //
  //   })
  // }

  // getPageData()

  // getDetails('9939393')

}
