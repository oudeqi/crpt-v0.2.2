import '../../app.css'
import './win.css'

import { openProductDetails, openTabLayout } from '../../webview.js'
import { http } from '../../config.js'
import numeral from 'numeral'

apiready = function() {

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
          <div class="l">
            <div class="col1">
            ${
              item.totalLimit > 0
              ? `
              <div class="otw red">${numeral(item.totalLimit).format('0,0.00')}</div>
              <p>最高可贷(元)</p>
              `
              : `
              <div class="otw red">${item.interestRate}%</div>
              <p>贷款利率</p>
              `
            }
            </div>
            <div class="col2">
              <p class="otw">${item.introduce || ''}</p>
              <p class="otw">${item.des || ''}</p>
            </div>
          </div>
          <div class="btn" tapmode="active" data-id="${item.id || ''}">立即开通</div>
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
      $api.byId('btnContainer').style.display = 'block'
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
        openProductDetails({
          id,
          open: 0 // 1 已开通， 0未开通
        })
      } else {
        api.toast({ msg: 'id 不存在' })
      }
    }
  }

  document.querySelector('#goIndex').onclick = function (event) {
    openTabLayout()
  }

}
