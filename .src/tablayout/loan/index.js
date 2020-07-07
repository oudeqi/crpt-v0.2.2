import '../../app.css'
import './index.css'

import Router from '../../router'
import { setRefreshHeaderInfo } from '../../config.js'

import http from '../../http'
import numeral from 'numeral'

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        userinfo: $api.getStorage('userinfo') || {},
        pageSize: 20,
        pageNo: 1,
        total: '*',
        totalSum: '',
        list: [],
        noData: true,
        noMore: false,
        loading: false,
        statusMap: {
          1: '申请中',
          2: '已审批通过',
          11: '待申请',
        },
        statusMapHXD: {
          0: '未申请',
          1: '已受理',
          2: '成功',
          3: '拒绝',
          4: '异常',
        },
        hxd: {}
      }
    },
    mounted: function () {
      this.pageInit()
    },
    methods: {
      numeral: numeral,

      handleHXDClick () {
        let status = this.hxd.creditStatus
        let productId = this.hxd.productId
        if (status === 0) { // 立即开通
          if (this.userinfo.userType === '1') { // 个人用户
            Router.openPage({ key: 'hxd_apply', params: { pageParam: { productId }}})
          } else if (this.userinfo.userType === '2') { // 企业用户
            Router.openPage({ key: 'hxd_a_supply', params: { pageParam: { productId }}})
          } else {
            api.toast({ msg: '未知的用户类型', location: 'middle' })
          }
        } else {
          Router.openPage({ key: 'hxd_u_apply', params: { pageParam: { productId }}})
        }
      },

      async loadMore () {
        this.getPageData()
      },

      async pageInit () {
        api.showProgress({ title: '加载中...', text: '', modal: false })
        await this.getHXD()
        await this.getPageData(1)
        api.hideProgress()
      },

      async getHXD () {
        try {
          let res = await http.get('/crpt-credit/credit/hxd/product/list')
          if (res.data && res.data[0]) {
            this.hxd = res.data[0]
          } else {
            api.toast({ msg: res.msg || '未查询到好销贷产品', location: 'middle' })
          }
        } catch (error) {
          api.toast({ msg: error.message || '出错啦', location: 'middle' })
        }
      },

      async getPageData (currentPage) {
        if (this.loading) { return }
        this.loading = true
        let pageSize =  this.pageSize
        let pageNo = currentPage || this.pageNo
        try {
          let res = await http.get(`/crpt-order/order/list/currentuser?pageSize=${pageSize}&pageNo=${pageNo}`)
          api.refreshHeaderLoadDone()
          this.loading = false
          this.total = res.data.count
          this.totalSum = numeral(res.data.totalAmount || 0).format('0,0.00')
          if (res.data.list && res.data.list.length > 0) {
            this.noData = false
            this.noMore = false
            this.pageNo = pageNo + 1
            if (pageNo === 1) {
              this.list = res.data.list
            } else {
              this.list.push(...res.data.list)
            }
          } else {
            if (pageNo === 1) {
              this.noData = true
            } else {
              this.noMore = true
            }
          }
        } catch (error) {
          api.toast({ msg: error.message || '出错啦', location: 'middle' })
        }
      },

      handleBtnClick (record) { // orderType 业务单类型：业务单类型:1-入库单（好销贷）、2-发票单、3-饲料订单、4-代养合同（押金贷）
        let productId = record.productId
        let orderNo = record.orderNo
        if (record.orderType === 1) { // 好销贷
          if (record.status === 11) { // 立即开通
            if (this.userinfo.userType === '1') { // 个人用户
              Router.openPage({ key: 'hxd_apply', params: { pageParam: {productId}}})
            } else if (this.userinfo.userType === '2') { // 企业用户
              Router.openPage({ key: 'hxd_a_supply', params: { pageParam: {productId}}})
            } else {
              api.toast({ msg: '未知的用户类型', location: 'middle' })
            }
          } else { // 继续开通
            Router.openPage({ key: 'hxd_u_apply', params: { pageParam: {productId}}})
          }
        } else if (record.orderType === 4) { // 押金贷
          // 业务单流程状态（押金贷专用，判断按钮展示及跳转页面）
          //1：户口本未上传 2：待客户经理审核 3：客户经理审核不通过 4：待平台审核 5：平台审核不通过 6： 平台审核通过 7-待绑定银行卡 8-绑卡成功
          if (record.orderFlowStatus === 8) { // 继续申请跳到贷款签约
            Router.openPage({ key: 'yjd_loan_signing' })
          } else {
            api.toast({ msg: '押金贷业务单流程状态不正确', location: 'middle' })
          }
        } else { // 其他
          Router.openPage({ key: 'loan_application', params: { pageParam: {id: orderNo}}})
        }
      },

      handleCancel (record) {
        console.log(record.orderNo)
        console.log(record.status)
        api.alert({
          title: '提示',
          msg: '功能开发中...',
        })
      }

    },
  })
}

apiready = function () {

  api.addEventListener({
    name: 'keyback'
  }, function() {
    api.closeWidget({
      silent: false
    })
  })

  const vm = vmInit()

  setRefreshHeaderInfo(function() {
    vm.pageInit()
  })

  api.addEventListener({
    name: 'scrolltobottom',
    extra: {
      threshold: 100
    }
  }, function() {
    vm.getPageData()
  })

  // document.querySelector('#list').onclick = function (event) {
  //   let applyBtn = $api.closest(event.target, '.apply')
  //   let cancelBtn = $api.closest(event.target, '.cancel')
  //   if (cancelBtn) {
  //     api.alert({
  //       title: '提示',
  //       msg: '功能开发中...',
  //     })
  //   } else if (applyBtn) {
  //     let id = applyBtn.dataset.id
  //     if (id) {
  //       Router.openPage({ key: 'loan_application' }, { id })
  //     } else {
  //       api.toast({ msg: 'id 不存在' })
  //     }
  //   }
  // }

}
