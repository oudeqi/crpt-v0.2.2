import '../../../app.css'
import './frm.less'
import { openLeftPane, openSettings, openProductList, openDanbaoKaitong } from '../../../webview.js'
import { http, setRefreshHeaderInfo } from '../../../config'
import numeral from 'numeral'
import Router from '../../../router'

class Service {
  getlist ({custType, status} = {}) {
    // custType // 1：通用   2：普惠担保  3：其他
    // status 查询状态 1-按产品额度降序 2-按产品利率升序
    return http.get('/crpt-product/product/query/home/show', {
      values: {custType, status}
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
      userinfo: $api.getStorage('userinfo'),
      custType: ($api.getStorage('userinfo') || {}).custType
    }
    this.el = {
      navDanbao: $api.byId('danbao'),
      navOther: $api.byId('other'),
      high: $api.byId('high'),
      low: $api.byId('low'),
    }
  }

  // 根据custType显示不同的nav
  renderNav () {
    // 担保客户仅可浏览担保类产品信息，不可看到其他信用类贷款产品；
    if (this.state.custType === '2') { // 1：通用   2：普惠担保  3：其他
      this.el.navDanbao.style.display = 'block'
    } else if (this.state.custType === '1' || this.state.custType === '3') {
      this.el.navOther.style.display = 'block'
    } else {
      api.toast({ msg: '未知的客户类型', location: 'middle' })
    }
  }

  // 点击担保开通
  goDanbao () {
    api.showProgress({ title: '加载中...', text: '', modal: false })
    this.queryDanbaoStatus().then(res => {
      api.hideProgress()
      const { applyStatus, productId, creditStatus } = res.data
      openDanbaoKaitong({step: applyStatus, productId, creditStatus})
    }).catch(error => {
      api.hideProgress()
      if (error.code === 3002) { // 无担保产品
        openProductList()
      } else {
        api.toast({
          msg: error.msg || '查询担保状态失败',
          location: 'middle'
        })
      }
    })
  }

  // 高额精选
  _renderHigh (arr) {
    this.el.high.innerHTML = ''
    arr.forEach((item, index) => {
      const tpl = `
        <div class="high_item clickBtn">
          <div class="row1">最高额度(元)</div>
          <div class="row2">${numeral(item.totalLimit).format('0,0')}</div>
          <div class="row3">${item.des}</div>
          <div class="row3">
            ${item.introduce}
          </div>
        </div>
      `
      if (index <= 1) {
        $api.append(this.el.high, tpl)
      }
    })
  }

  // 利息最低
  _renderLow (arr) {
    this.el.low.innerHTML = ''
    arr.forEach((item) => {
      const tpl = `
        <div class="row clickBtn">
          <div class="l">
            <strong>${item.interestRate}%</strong>
            <span>贷款利率</span>
          </div>
          <div class="r">
            <strong>${item.des}</strong>
            <span>${item.introduce}</span>
          </div>
        </div>
      `
      $api.append(this.el.low, tpl)
    })
  }

  // 获取数据
  renderProduct () {
    const custType = this.state.custType
    Promise.all([
      this.getlist({custType, status: 1}),
      this.getlist({custType, status: 2}),
    ]).then(res => {
      api.refreshHeaderLoadDone()
      this._renderHigh(res[0].data.list || [])
      this._renderLow(res[1].data.list || [])
    }).catch(error => {
      api.refreshHeaderLoadDone()
      api.toast({
        msg: error.msg || '获取产品数据失败',
        location: 'middle'
      })
    })
  }
}

apiready = function () {

  document.querySelector('#body').onclick = function (event) {
    let clickBtn = $api.closest(event.target, '.clickBtn')
    if (clickBtn) {
      api.alert({
        title: '提示',
        msg: '功能开发中...',
      })
    }
  }

  api.addEventListener({
    name: 'keyback'
  }, function (ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })

  const controller = new PageController()
  $api.byId('kaitong').onclick = () => {
    controller.goDanbao()
  }
  $api.byId('danbaofuwu').onclick = () => {
    controller.goDanbao()
  }
  $api.byId('gongyingshang').onclick = () => { // 供应商服务
    Router.openPage({ key: 'com_product_list', params: {
      pageParam: {pageFrom: 'gongyingshang'}}
    })
  }
  $api.byId('hezuoyanghu').onclick = () => { // 合作养护服务
    Router.openPage({ key: 'com_product_list', params: {
      pageParam: {pageFrom: 'hezuoyanghu'}}
    })
  }
  controller.renderNav()
  controller.renderProduct()
  
  setRefreshHeaderInfo((ret, err) => {
    controller.renderNav()
    controller.renderProduct()
  })

  // api.setTabLayoutAttr({
  //   hideNavigationBar: true
  // })
  //
  // api.addEventListener({
  //   name:'tabframe'
  // }, function(ret, err){
  //   if (ret.name === 'tablayout/index') {
  //     api.setTabLayoutAttr({
  //       hideNavigationBar: true
  //     })
  //   } else {
  //     api.setTabLayoutAttr({
  //       hideNavigationBar: false
  //     })
  //   }
  // })



  // api.addEventListener({
  //   name: 'swiperight'
  // }, function(ret, err){
  //   openLeftPane()
  // })

  // api.addEventListener({
  //   name: 'navitembtn'
  // }, (ret, err) => {
  //   if (ret.type === 'left') {
  //     openLeftPane()
  //   }else {
  //     openSettings()
  //   }
  // })

}
