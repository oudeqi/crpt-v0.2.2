import '../../../app.css'
import './win.css'

import { openProductDetails, openTabLayout, openDanbaoKaitong } from '../../../webview.js'
import { http, setRefreshHeaderInfo } from '../../../config.js'
import numeral from 'numeral'


class Service {
  getData ({ custType } = {}) {
    return http.get('/crpt-product/product/online/list', {
      values: { custType }
    })
  }
  // 获取担保状态
  queryDanbaoStatus () {
     return http.get('/crpt-guarantee/gt/apply/query')
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
    this.el.list.onclick = (event) => {
      let btn = $api.closest(event.target, '.btn')
      let li = $api.closest(event.target, 'li')
      if (btn) {
        let name = li.dataset.name
        let id = li.dataset.id
        this._goDanbao(id, name)
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
  // 去担保开通页面
  _goDanbao (id, name) {
    this.queryDanbaoStatus().then(res => {
      api.toast({
        msg: '已有开通的担保产品',
        location: 'middle'
      })
    }).catch(error => {
      if (error.code === 3002) { // 无担保产品
        openDanbaoKaitong({
          step: 0,
          productId: id,
        })
      } else {
        api.toast({
          msg: error.msg || '查询担保状态失败',
          location: 'middle'
        })
      }
    })
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
              <p class="otw">${item.des || ''}</p>
              <p class="otw">${item.introduce || ''}</p>
            </div>
          </div>
          <div class="btn" tapmode="active" data-id="${item.id || ''}" data-name="${item.name || ''}">立即开通</div>
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
