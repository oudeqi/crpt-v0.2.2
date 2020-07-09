import '../../app.css'
import './index.css'

import Router from '../../router'
import http from '../../http'
import numeral from 'numeral'

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        pageParam: api.pageParam || {},
        appcodeMap: {
          1: 'EBS',
          2: '客户',
          3: '产融',
        },
        mapping: {
          1: '申请中',
          2: '已审批通过',
          3: '已拒绝',
          4: '已撤销',
          5: '还款中',
          6: '到期结清',
          7: '提前结清',
          8: '逾期还款中',
          9: '逾期已结清',
          10: '已退货',
          11: '待申请',
          12: '已取消',
        },
        statusMapping: {
          3: 'refused',
          4: 'cancel',
          5: 'repaying',
          6: 'normalOver',
          7: 'earlyOver',
          8: 'overdue',
          9: 'overdueOver',
          10: 'back',
        },
        data: {}
      }
    },
    computed: {
      id: function () {
        return this.pageParam.id
      }
    },
    mounted: function () {
      this.pageInit()
    },
    methods: {

      numeral: numeral,

      async pageInit () {
        api.showProgress({ title: '加载中...', text: '', modal: false })
        await this.getPageData()
        api.hideProgress()
      },

      async getPageData () {
        // 业务单状态：
        // 1-申请中,2-已审批通过,3-已拒绝,4-已撤销,5-还款中,6-到期结清,7-提前结清,
        // 8-逾期还款中,9-逾期已结清,10-已退货 11-待申请 12-已取消
        let id = this.id
        try {
          let res = await http.get(`/crpt-order/order/detail/app?orderNo=${id}`)
          this.data = res.data
        } catch (error) {
          api.toast({ msg: error.msg || '请求发生错误', location: 'middle' })
        }
      },

      openPlan () {
        let id = this.id
        Router.openPage({ key: 'repay_plan', params: {pageParam: { id }}})
      },

      openRecord () {
        let id = this.id
        Router.openPage({ key: 'repay_record', params: {pageParam: { id }}})
      },

      openLoanContract () {
        api.alert({
          title: '提示',
          msg: '功能开发中...',
        })
        // let id = this.id
        // Router.openPage({ key: 'yjd_contract_loan', params: {pageParam: { id }}})
      },

    }
  })
}


apiready = function () {

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  vmInit()

}
