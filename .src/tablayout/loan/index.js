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
        }
      }
    },
    mounted: function () {
      this.getPageData(1)
    },
    methods: {
      numeral: numeral,
      async loadMore () {
        this.getPageData()
      },
      async getPageData (currentPage) {
        if (this.loading) { return }
        this.loading = true
        let pageSize =  this.pageSize
        let pageNo = currentPage || this.pageNo
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
        setTimeout(() => {
          api.parseTapmode()
        }, 300)
      },

      handleBtnClick (record) { // orderType 业务单类型：业务单类型:1-入库单（好销贷）、2-发票单、3-饲料订单、4-代养合同（押金贷）
        if (record.orderType === 1) { // 好销贷
          if (record.status === 11) { // 立即开通
            if (this.userinfo.userType === '1') { // 个人用户
              Router.openPage({ key: 'hxd_apply' })
            } else if (this.userinfo.userType === '2') { // 企业用户
              Router.openPage({ key: 'hxd_a_supply' })
            } else {
              api.toast({ msg: '未知的用户类型', location: 'middle' })
            }
          } else { // 继续开通
            Router.openPage({ key: 'hxd_u_apply' })
          }
        } else if (record.orderType === 4) { // 押金贷
          Router.openPage({ key: 'yjd_loan_details' })
        } else { // 其他
          Router.openPage({ key: 'loan_application' }, {id: record.orderNo})
        }
      },

      handleCancel (record) {
        console.log(record.orderNo)
        console.log(record.status)
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
    vm.getPageData(1)
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
