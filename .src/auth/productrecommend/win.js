import '../../app.css'
import './win.css'

import { openProductDetails, openTabLayout } from '../../webview.js'
import { http, setRefreshHeaderInfo } from '../../config.js'
import numeral from 'numeral'


class Service {
  getData ({ custType } = {}) {
    return http.get('/crpt-product/product/online/list', {
      values: { custType }
    })
  }
}


class PageController extends Service {
  constructor () {
    super(...arguments)
    this.state = {
      pageNo: 1,
      loading: false,
      userinfo: $api.getStorage('userinfo'),
      custType: ($api.getStorage('userinfo') || {}).custType
    }
    this.el = {
      list: $api.byId('list'),
      goIndex: document.querySelector('#goIndex'),
    }
  }
  // 事件绑定
  bindEvend () {
    // 去下一页
    this.el.goIndex.onclick = function (event) { openTabLayout() }
    // 下拉刷新
    setRefreshHeaderInfo((ret, err) => {
      this.state.pageNo = 1
      this._getPageData(data => {
        this.el.list.innerHTML = ''
        this._renderList(data)
        $api.byId('btnContainer').style.display = 'block'
      })
    })
    // 点击列表项目
    this.el.list.onclick = function (event) {
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
  }
  // 生成列表
  _renderList (arr) {
    arr.forEach(item => {
      $api.append(this.el.list, `
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
  // 获取页面数据
  _getPageData (cb) {
    if (this.state.loading) {
      return
    }
    this.state.loading = true
    let { custType } = this.state
    this.getData({ custType }).then(res => {
      this.state.loading = false
      api.refreshHeaderLoadDone()
      if (res && res.data.length > 0) {
        this.state.pageNo++
        cb && cb(res.data)
      } else if (this.state.pageNo === 1) {
        api.toast({ msg: '无数据'})
      } else {
        api.toast({ msg: '无更多数据'})
      }
    }).catch(error => {
      this.state.loading = false
      api.refreshHeaderLoadDone()
      api.toast({ msg: '数据加载失败' })
    })
  }
}

apiready = function() {

  const controller = new PageController()
  controller.bindEvend()
  api.refreshHeaderLoading()

}
