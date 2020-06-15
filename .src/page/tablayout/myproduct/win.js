import '../../../app.css'
import './win.css'

import { openProductDetails, openContactUs } from '../../../webview.js'
import { http, setRefreshHeaderInfo } from '../../../config.js'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let pageSize = 20
  let pageNo = 1
  let loading = false

  function getPageData (cb) {
    if (loading) {
      return
    }
    loading = true
    http.get(`/crpt-cust/product/openinglist/`).then(res => {
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
        <li tapmode data-id="${item.productId || ''}">
          <div class="t">
            <strong>${item.productName || '***'}</strong>
            <span>${item.bankName || '***'}（${item.account || '***'}）</span>
          </div>
          <div class="b">
            开通时间：${item.openDate || ''}
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
    if (id) {
      openProductDetails({
        id,
        open: 1  // 1 已开通， 0未开通
      })
    } else {
      api.toast({ msg: 'id 不存在' })
    }
  }

  document.querySelector('#contactus').onclick = function (event) {
    openContactUs()
  }


}
