import '../../app.css'
import './frm.less'

import Router from '../../router'
import { setRefreshHeaderInfo } from '../../config.js'

import http from '../../http'
import numeral from 'numeral'

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        pageSize: 20,
        pageNo: 1,
        total: null,
        list: [],
        loading: false,
        more: 'noData', // hasMore,noMore,noData
        mapping: {
          3: 'refused',
          4: 'cancel',
          5: 'repaying',
          6: 'normalOver',
          7: 'earlyOver',
          8: 'overdue',
          9: 'overdueOver',
          10: 'back',
        },
        mapping2: {
          3: '已拒绝',
          4: '已撤销',
          5: '还款中',
          6: '到期结清',
          7: '提前结清',
          8: '逾期还款中',
          9: '逾期已结清',
          10: '已退货',
        }
      }
    },
    mounted: function () {
      this.pageInit()
    },
    methods: {
      numeral: numeral,

      async loadMore () {
        this.getPageData()
      },

      async pageInit () {
        api.showProgress({ title: '加载中...', text: '', modal: false })
        await this.getPageData(1)
        api.hideProgress()
      },

      async getPageData (currentPage) {
        if (this.loading) { return }
        this.loading = true
        let pageSize =  this.pageSize
        let pageNo = currentPage || this.pageNo
        try {
          let res = await http.get(`/crpt-order/order/payInfo?status=3&pageSize=${pageSize}&pageNo=${pageNo}`)
          api.refreshHeaderLoadDone()
          this.loading = false
          this.total = res.data.count
          if (res.data.list && res.data.list.length > 0) {
            this.more = 'hasMore'
            this.pageNo = pageNo + 1
            if (pageNo === 1) {
              this.list = res.data.list
            } else {
              this.list.push(...res.data.list)
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

      openDetails (record) {
        const { orderType, orderId, orderNo } = record
        // orderType 1-入库单、2-发票单、3-饲料订单、4-代养合同
        if (String(orderType) === '1') { // 好销宝
          Router.openPage({ key: 'hxd_loan_details', params: {pageParam: { orderId, orderNo }}})
        } else if (String(orderType) === '2') { // 以前的
          Router.openPage({ key: 'loan_details', params: {pageParam: { orderId, orderNo }}})
        } else if (String(orderType) === '3') { // 以前的
          Router.openPage({ key: 'loan_details', params: {pageParam: { orderId, orderNo }}})
        } else if (String(orderType) === '4') { // 押金贷
          Router.openPage({ key: 'yjd_loan_details', params: {pageParam: { orderId, orderNo, status: 'invalid' }}})
        } else {
          api.toast({ msg: '未知的产品', location: 'middle' })
        }
      }

    },
  })
}

apiready = function () {

  const vm = vmInit()

  setRefreshHeaderInfo(function() {
    vm.pageInit()
  })

  api.addEventListener({
    name: 'scrolltobottom',
    extra: { threshold: 100 }
  }, function() {
    vm.getPageData()
  })

}
