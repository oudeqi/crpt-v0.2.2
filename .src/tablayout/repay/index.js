import '../../app.css'
import './index.css'

import Router from '../../router'
import { setRefreshHeaderInfo } from '../../config.js'
import http from '../../http'
import numeral from 'numeral'
// import filterDict from '../../utils/dict_filter/filter.js'
// import moment from 'moment'
// import find from 'lodash/find'

function openDialog (orderNo, loanInPocketTime, loanAmount) {
  api.openFrame({
    reload: true,
    name: 'drawer',
    bounces: false,
    bgColor: 'rgba(0,0,0,0)',
    url: 'widget://html/repay/drawer.html',
    rect: {
      x: 0,
      y: 0,
      w: 'auto',
      h: 'auto'
    },
    pageParam: {
      id: orderNo,
      date: loanInPocketTime,
      money: loanAmount,
    }
  })
}

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        pageSize: 20,
        pageNo: 1,
        total: '*',
        totalSum: '***',
        overdueExist: 0, // 是否存在逾期记录 0 否 1 是
        list: [],
        loading: false,
        more: 'noData', // hasMore,noMore,noData
        repayStatusMap: {},
        userinfo: $api.getStorage('userinfo') || {},
      }
    },
    computed: {
      userType: function () { // 1个人，2企业
        return this.userinfo.userType + ''
      },
    },
    mounted: async function () {
      
      this.pageInit()
    },
    methods: {

      numeral: numeral,

      async loadMore () {
        this.getPageData()
      },

      async pageInit () {
        api.showProgress({ title: '加载中...', text: '', modal: false })
        // this.repayStatusMap = await filterDict('duebillStatus') // orderType
        // orderType {"1":"入库单","2":"发票单","3":"饲料订单","4":"代养合同"}
        // repayStatus {"1":"申请中","2":"已审批通过","3":"已拒绝","4":"已撤销","5":"还款中","6":"到期结清",
        // "7":"提前结清","8":"逾期还款中","9":"逾期已结清","10":"已退货","11":"已作废"}
        await this.getPageData(1)
        api.hideProgress()
      },

      async getPageData (currentPage) {
        if (this.loading) { return }
        this.loading = true
        let pageSize =  this.pageSize
        let pageNo = currentPage || this.pageNo
        try {
          let res = await http.get(`/crpt-credit/credit/mine/repay/list?pageIndex=${pageNo}&pageSize=${pageSize}`)
          api.refreshHeaderLoadDone()
          this.loading = false
          this.total = res.data.count
          this.overdueExist = parseInt(res.data.overdueExist)
          this.totalSum = numeral(res.data.repayPrincipalAmount || 0).format('0,0.00')
          if (res.data.repayList && res.data.repayList.length > 0) {
            this.more = 'hasMore'
            this.pageNo = pageNo + 1
            if (pageNo === 1) {
              this.list = res.data.repayList
            } else {
              this.list.push(...res.data.repayList)
            }
          } else {
            if (pageNo === 1) {
              this.more = 'noData'
            } else {
              this.more = 'noMore'
            }
          }
        } catch (error) {
          api.toast({ msg: error.message || '出错啦', location: 'middle' })
          api.refreshHeaderLoadDone()
          this.loading = false
        }
      },

      repay (record) {
        let { loanId, orderType, repayStatus, productName, planId, repayResult } = record
        if (String(orderType) === '4') { // 押金贷
          if (String(repayResult) !== '1') {
            Router.openPage({ key: 'com_repay_trial', params: { pageParam: { loanId, planId }}})
          }
        } else if (String(orderType) === '1') { // 好销宝
          if (String(repayStatus) === '8') {
            api.toast({ msg: '未按期还款的订单不支持线上还款', location: 'middle' })
          } else {
            api.alert({
              title: '提示',
              msg: `${productName}的还款功能正在开发中...`,
            })
          }
        } else { // 其他贷款
          api.alert({
            title: '提示',
            msg: `${productName}的还款功能正在开发中...`,
          })
        }
      },

      repayRemain (record) {
        let { orderNo, loanInPocketTime, loanAmount } = record
        openDialog(orderNo, loanInPocketTime, loanAmount)
      }
    }
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

}
