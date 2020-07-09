import '../../app.css'
import './index.css'

// import Router from '../../router'
import { setRefreshHeaderInfo } from '../../config.js'
import http from '../../http'
import numeral from 'numeral'
// import moment from 'moment'
// import find from 'lodash/find'

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        pageSize: 20,
        pageNo: 1,
        total: '*',
        totalSum: '***',
        list: [],
        loading: false,
        more: 'noData', // hasMore,noMore,noData
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
          let res = await http.get(`/crpt-credit/credit/mine/repay/list?pageIndex=${pageNo}&pageSize=${pageSize}`)
          api.refreshHeaderLoadDone()
          this.loading = false
          this.total = res.data.count
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
