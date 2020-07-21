import '../../app.css'
import './win.less'

import http from '../../http'
import { setRefreshHeaderInfo } from '../../config.js'
import moment from 'moment'
import numeral from 'numeral'

function vmInit() {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        pageParam: (api.pageParam || {}).list,
        list: [],
        loading: false,
        more: 'noData', // hasMore,noMore,noData
        bankName: '***',
        account: '***',
      }
    },
    computed: {
      status: function () { // 1: '正常', 2: '未按期还款', 3: '今日还款'
        return this.pageParam.status
      },
      productName: function () {
        return this.pageParam.productName
      },
      orderNo: function () {
        return this.pageParam.orderNo
      },
      billDate: function () {
        return this.pageParam.billDate
      },
      sumRepayTotalAmount: function () {
        return this.pageParam.sumRepayTotalAmount
      }, 
      sumRepayPrincipalAmount: function () {
        return this.pageParam.sumRepayPrincipalAmount
      }, 
      sumServiceFee: function () {
        return this.pageParam.sumServiceFee
      }, 
      sumRepayPenaltyAmount: function () {
        return this.pageParam.sumRepayPenaltyAmount
      }, 
      sumRepayInterestAmount: function () {
        return this.pageParam.sumRepayInterestAmount
      }, 
    },
    mounted: async function () {
      this.pageInit()
    },
    methods: {
      numeral: numeral,
      moment: moment,

      async pageInit () {
        api.showProgress({ title: '加载中...', text: '', modal: false })
        await this.getPageData()
        api.hideProgress()
      },

      async getPageData () {
        if (this.loading) { return }
        this.loading = true
        try {
          const res = await http.post(`/crpt-credit/credit/repay/mybill/billdetail`, {
            body: { orderNo: this.orderNo }
          })
          api.refreshHeaderLoadDone()
          this.loading = false
          if (res.code === 200) {
            this.bankName = res.data.bankName || ''
            this.account = res.data.account || ''
            if (res.data.list && res.data.list.length > 0) {
              this.list = res.data.list
            } else {
              this.more = 'noData'
            }
          } else {
            api.toast({ msg: res.msg || '出错啦', location: 'middle' })
          }
        } catch (error) {
          api.toast({ msg: error.message || '出错啦', location: 'middle' })
          api.refreshHeaderLoadDone()
          this.loading = false
        }
      },

    }
  })
}

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  const vm = vmInit()

  setRefreshHeaderInfo(function(ret, err) {
    vm.getPageData()
  })

}
