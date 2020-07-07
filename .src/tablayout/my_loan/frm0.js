import '../../app.css'
import './frm.less'

import Router from '../../router'
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
    http.get(`/crpt-order/order/payInfo?status=1&pageSize=${pageSize}&pageNo=${pageNo}`).then(res => {
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
    // 业务单状态：
    // 3-已拒绝 4-已撤销 5-还款中 6-到期结清 7-提前结清
    // 8-逾期还款中 9-逾期已结清 10-已退货
    let mapping = {
      3: 'refused',
      4: 'cancel',
      5: 'repaying',
      6: 'normalOver',
      7: 'earlyOver',
      8: 'overdue',
      9: 'overdueOver',
      10: 'back',
    }
    let mapping2 = {
      3: '已拒绝',
      4: '已撤销',
      5: '还款中',
      6: '到期结清',
      7: '提前结清',
      8: '逾期还款中',
      9: '逾期已结清',
      10: '已退货',
    }
    data.forEach(item => {
      $api.append($api.byId('list'), `
        <li tapmode data-id="${item.orderNo || ''}">
          <div class="t">
            <div class="row1">
              <span>业务单号：${item.orderNo || ''}</span>
              <i class="aui-iconfont aui-icon-right"></i>
            </div>
            <div class="b">
              <div class="tit">
                <div class="amount">贷款金额(元) 
                  <span class="status ${mapping[item.status]}">${mapping2[item.status] || ''}</span>
                </div>
                <span class="num">${numeral(item.payAmount).format('0,0.00')}</span>
              </div>
            </div>
            <div class="row2">
              <span>收款方</span>
              ${item.saleCustName || ''}
            </div>
            <div class="row2">
              <span>放款时间</span>
              ${item.orderTime || ''}
            </div>
            <div class="row3">
              <span class="label">贷款产品</span>
              <strong class="produce">${item.productName || ''}</strong>

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
      Router.openPage({ key: 'loan_details', params: {pageParam: { id }}})
    } else {
      api.toast({ msg: 'id 不存在' })
    }
  }


}
