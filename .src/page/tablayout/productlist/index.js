import '../../../app.css'
import './index.css'

import { openProductDetails, openDanbaoKaitong } from '../../../webview.js'
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
      custType: ($api.getStorage('userinfo') || {}).custType,
      type: api.pageParam.type // 产品类型：1-信用贷款 2-担保贷款
    }
    this.el = {
      list: $api.byId('list')
    }
  }
  // 事件绑定
  bindEvend () {
    // 下拉刷新
    setRefreshHeaderInfo(() => {
      this.getPageData()
    })
    // 点击列表项目
    this.el.list.onclick = (event) => {
      let btn = $api.closest(event.target, '.btn')
      let li = $api.closest(event.target, 'li')
      if (btn) {
        let name = btn.dataset.name
        let type = btn.dataset.type // 产品类型：1-信用贷款 2-担保贷款
        let id = btn.dataset.id
        if (type === '2' || type === 2) {
          this.__goDanbao(id, name)
        } else {
          api.alert({
            title: '提示',
            msg: '功能开发中...',
          })
        }
      } else if (li) {
        let id = li.dataset.id
        if (id) {
          openProductDetails({
            id, open: 0 // 1 已开通， 0未开通
          })
        } else {
          api.toast({ msg: 'id 不存在', location: 'middle' })
        }
      }
    }
  }
  // 去担保开通页面
  __goDanbao (id, name) {
    this.queryDanbaoStatus().then(res => {
      api.toast({ msg: '已有开通的担保产品', location: 'middle' })
    }).catch(error => {
      if (error.code === 3002) { // 无担保产品
        openDanbaoKaitong({
          step: 0,
          productId: id,
        })
      } else {
        api.toast({ msg: error.msg || '查询担保状态失败', location: 'middle' })
      }
    })
  }
  // 生成列表
  __renderList (arr) {
    this.el.list.innerHTML = ''
    arr.forEach(item => {
      $api.append(this.el.list, `
        <li tapmode data-id="${item.id || ''}">
          <div class="t">
            ${item.des || ''}
          </div>
          <div class="b">
            <div class="num">
            ${
              item.totalLimit > 0
              ? `<strong>${numeral(item.totalLimit).format('0,0')}</strong><span>最高可贷(元)</span>`
              : `<strong>${item.interestRate}%</strong><span>贷款利率</span>`
            }
            </div>
            <div class="txt">
              ${item.introduce || ''}
            </div>
            <div class="btn" tapmode="active" data-id="${item.id || ''}" data-type="${item.type || ''}" data-name="${item.name || ''}">立即开通</div>
          </div>
        </li>
      `)
    })
    api.parseTapmode()
  }
  // 获取页面数据
  async getPageData () {
    if (this.state.loading) { return }
    this.state.loading = true
    let { custType } = this.state
    try {
      let res = await this.getData({ custType })
      let list = res.data || []
      if (res.code === 200 && list.length > 0) {
        $api.byId('list-box').style.display = 'block'
        $api.byId('nodata').style.display = 'none'
        this.__renderList(list)
      } else {
        $api.byId('list-box').style.display = 'none'
        $api.byId('nodata').style.display = 'block'
      }
    } catch (error) {
      api.toast({ msg: error.meaasge || '数据加载失败', location: 'middle' })
    }
    this.state.loading = false
    api.refreshHeaderLoadDone()
  }
}

apiready = function() {

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  const ctrl = new PageController()
  ctrl.bindEvend()
  ctrl.getPageData()

}
