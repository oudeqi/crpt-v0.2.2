import '../../styles/common.less'
import './drawer.css'
import AppDrawer from '../../common/component/app-drawer'

import http from '../../http'
import numeral from 'numeral'

function vmInit () {
  return new Vue({
    el: '#app',
    components: {
      'app-drawer': AppDrawer
    },
    data: function () {
      return {
        pageParam: api.pageParam || {},
        pageSize: 100,
        pageNo: 1,
        total: '*',
        list: [],
        loading: false,
        more: 'noData', // hasMore,noMore,noData
      }
    },
    computed: {
      id: function () {
        return this.pageParam.id
      },
      date: function () {
        return this.pageParam.date
      },
      money: function () {
        return this.pageParam.money
      }
    },
    mounted: function () {
      console.log(this.id)
      this.pageInit()
    },
    methods: {

      numeral: numeral,

      onClose () {
        api.closeFrame({ name: 'drawer' })
      },

      async pageInit () {
        await this.getPageData(1)
      },

      async loadMore () {
        this.getPageData()
      },

      async getPageData (currentPage) {
        if (this.loading) { return }
        this.loading = true
        let pageSize =  this.pageSize
        let pageNo = currentPage || this.pageNo
        let id = this.id
        try {
          let res = await http.get(`/crpt-credit/credit/repay/query/repayplan?pageSize=${pageSize}&pageNo=${pageNo}&orderNo=${id}`)
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
          this.loading = false
        }
      },

    },
  })
}


apiready = function () {

  const vm = vmInit()

}