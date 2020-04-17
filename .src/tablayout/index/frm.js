import '../../app.css'
import './frm.css'

import { openLeftPane, openProductDetails } from '../../webview.js'
import { http } from '../../config.js'
import numeral from 'numeral'

apiready = function () {

  api.addEventListener({
    name: 'keyback'
  }, function(ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })

  api.addEventListener({
    name: 'swiperight'
  }, function(ret, err){
    openLeftPane()
  });

  api.addEventListener({
    name: 'navitembtn'
  }, (ret, err) => {
    if (ret.index === 0) {
      openLeftPane()
    } else {
      alert('点错按钮了')
    }
  })

  let pageSize = 20
  let pageNo = 1
  let loading = false

  function getPageData (cb) {
    if (loading) {
      return
    }
    loading = true
    http.get(`/crpt-product/product/online/list?pageSize=${pageSize}&pageNo=${pageNo}`).then(res => {
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
        <li tapmode data-id="${item.id || ''}">
          <div class="col">
          ${
            item.totalLimit > 0
            ? `
            <div class="red">${numeral(item.totalLimit).format('0,0.00')}</div>
            <p>最高可贷(元)</p>
            `
            : `
            <div class="red">${item.interestRate}%</div>
            <p>贷款利率</p>
            `
          }
          </div>
          <div class="col">
            <p class="otw">${item.introduce || ''}</p>
            <p class="otw">${item.des || ''}</p>
          </div>
          <div class="col">
            <div class="btn" tapmode="active" data-id="${item.id || ''}">立即开通</div>
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
    let btn = $api.closest(event.target, '.btn')
    let li = $api.closest(event.target, 'li')
    if (btn) {
      api.alert({
        title: '提示',
        msg: '功能开发中...',
      })
    } else if (li) {
      let id = li.dataset.id
      if (id) {
        openProductDetails(id)
      } else {
        api.toast({ msg: 'id 不存在' })
      }
    }
  }
}
