import '../../../app.css'
import './win.css'

import { openProductDetails, openTabLayout, openDanbaoKaitong } from '../../../webview.js'
import { setRefreshHeaderInfo } from '../../../config.js'
import numeral from 'numeral'
import http from '../../../http'
import Router from '../../../router'

class Service {
  // 获取推荐列表
  static getData (userType) {
    // /crpt-product/product/online/list
    // /crpt-product/product/online/list/after/register
    return http.get('/crpt-product/product/online/list/after/register', {
      values: { userType }
    })
  }
  // 获取担保状态
  static queryDanbaoStatus () {
    return http.get('/crpt-guarantee/gt/apply/query')
  }

}


function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        loading: false,
        userinfo: $api.getStorage('userinfo') || {},
        list: [],
        more: 'noData', // hasMore,noMore,noData
      }
    },
    computed: {
      custType: function () {
        return this.userinfo.custType
      },
      userType: function () { // // 用户类型：1-个人 2-企业
        return this.userinfo.userType + ''
      }
    },
    mounted: function () {
      this.initPage()
    },
    methods: {

      numeral: numeral,

      async initPage () {
        api.showProgress({ title: '数据加载中...', text: '' })
        await this.getpageList()
        api.hideProgress()
      },

      async getpageList () {
        if (this.loading) { return }
        this.loading = true
        try {
          const res = await Service.getData(this.userType)
          if (res.data && res.data.list && res.data.list.length > 0) {
            this.list = res.data.list
            this.more = 'hasMore'
          } else {
            this.more = 'noData'
          }
        } catch (e) {
          api.toast({ msg: e.msg || '出错啦', location: 'middle' })
        }
        this.loading = false
        api.refreshHeaderLoadDone()
      },

      goIndex () {
        openTabLayout()
      },

      handleBtnClick (record) {
        let name = record.name
        let type = record.type + '' // 产品类型：1-信用贷款（押金贷） 2-担保贷款 3-上游入库单贷款（好销宝）
        let id = record.id
        if (type === '1') { // 信用贷款（押金贷）
          Router.openPage({key: 'yjd_account_open', params: {pageParam: { productId: id }}})
        } else if (type === '2') { // 担保贷款
          this.__goDanbao(id, name)
        } else if (type === '3') { // 上游入库单贷款（好销宝）
          if (this.userType === '1') { // 个人用户
            Router.openPage({key: 'hxd_apply', params: {pageParam: { productId: id }}})
          } else if (this.userType === '2') { // 企业用户
            Router.openPage({key: 'hxd_a_supply', params: {pageParam: { productId: id }}})
          } else {
            api.toast({ msg: '未知的用户类型', location: 'middle'})
          }
        } else {
          api.alert({
            title: '提示',
            msg: '功能开发中...',
          })
        }
      },

      // 去担保开通页面
      __goDanbao (id, name) {
        Service.queryDanbaoStatus().then(res => {
          api.toast({ msg: '已有开通的担保产品', location: 'middle' })
        }).catch(error => {
          if (error.code === 3002) { // 无担保产品
            openDanbaoKaitong({ step: 0, productId: id })
          } else {
            api.toast({ msg: error.msg || '查询担保状态失败', location: 'middle' })
          }
        })
      },

      handleItemClick (record) {
        openProductDetails({
          id: record.id,
          open: 0 // 1 已开通， 0未开通
        })
      },
    },
  })
}


class PageController extends Service {
  constructor () {
    super(...arguments)
    this.state = {
      pageNo: 1,
      loading: false,
      userinfo: $api.getStorage('userinfo'),
      custType: ($api.getStorage('userinfo') || {}).custType,
      userType: ($api.getStorage('userinfo') || {}).userType + '' // 用户类型：1-个人 2-企业
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
      this.__getPageData(data => {
        this.el.list.innerHTML = ''
        this.__renderList(data)
        $api.byId('btnContainer').style.display = 'block'
      })
    })
    // 点击列表项目
    this.el.list.onclick = (event) => {
      let btn = $api.closest(event.target, '.btn')
      let li = $api.closest(event.target, 'li')
      if (btn) {
        let name = btn.dataset.name
        let type = String(btn.dataset.type) // 产品类型：1-信用贷款（押金贷） 2-担保贷款 3-上游入库单贷款（好销宝）
        let id = btn.dataset.id
        if (String(type) === '1') { // 信用贷款（押金贷）
          Router.openPage({key: 'yjd_account_open', params: {pageParam: { productId: id }}})
        } else if (String(type) === '2') { // 担保贷款
          this.__goDanbao(id, name)
        } else if (String(type) === '3') { // 上游入库单贷款（好销宝）
          if (this.state.userType === '1') { // 个人用户
            Router.openPage({key: 'hxd_apply', params: {pageParam: { productId: id }}})
          } else if (this.state.userType === '2') { // 企业用户
            Router.openPage({key: 'hxd_a_supply', params: {pageParam: { productId: id }}})
          } else {
            api.toast({ msg: '未知的用户类型', location: 'middle'})
          }
        } else {
          api.alert({
            title: '提示',
            msg: '功能开发中...',
          })
        }
      } else if (li) {
        let id = li.dataset.id
        openProductDetails({
          id,
          open: 0 // 1 已开通， 0未开通
        })
      }
    }
  }
  // 去担保开通页面
  __goDanbao (id, name) {
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
  __renderList (arr) {
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
  __getPageData (cb) {
    if (this.state.loading) { return }
    this.state.loading = true
    let { userType } = this.state
    this.getData(userType).then(res => {
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

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  const vm = vmInit()

  setRefreshHeaderInfo(function() {
    vm.getpageList()
  })

}
