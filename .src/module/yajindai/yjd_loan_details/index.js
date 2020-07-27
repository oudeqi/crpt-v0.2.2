import '../../../app.css'
import './index.css'

import Router from '../../../router'
import http from '../../../http'
import numeral from 'numeral'

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        pageParam: api.pageParam || {},
        url: {
          invalid: '/crpt-order/order/yjd/loan/detail/invalid/query',
          valid: '/crpt-order/order/yjd/loan/detail/query',
        },
        appcodeMap: {
          1: 'EBS',
          2: '客户',
          3: '产融',
        },
        repayTypeMap: {
          4: '到期还本付息',
          5: '等额本息',
          7: '先息后本',
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
      orderId: function () {
        return this.pageParam.orderId
      },
      orderNo: function () {
        return this.pageParam.orderNo
      },
      status: function () {
        return this.pageParam.status || 'valid'
      }
    },
    mounted () {
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
        let orderId = this.orderId
        let url = this.url[this.status]
        try {
          let res = await http.get(`${url}?orderId=${orderId}`)
          this.data = res.data || {}
        } catch (error) {
          api.toast({ msg: error.msg || '请求发生错误', location: 'middle' })
        }
      },

      openPlan () {
        let orderNo = this.orderNo
        Router.openPage({ key: 'repay_plan', params: {pageParam: { orderNo }}})
      },

      openRecord () {
        let orderNo = this.orderNo
        Router.openPage({ key: 'repay_record', params: {pageParam: { orderNo }}})
      },

      openLoanContract () {
        Router.openPage({ key: 'pdf_agreement', params: {pageParam: {
          type: 'pdf',
          id: this.data.contractId
        }}})
      },

      openDaiyangContract () {
        let data = this.data || {}
        let {
          outCode, // 代养合同编号
          payee, // 收款方
          signedDate, // 签订日期
          receivableBond, // 应收保证金
          receivedBond, // 已收保证金
          surplusReceivableBond, // 剩余应收保证金
        } = data
        Router.openPage({ key: 'yjd_contract_daiyang', params: {pageParam: {
          outCode,
          payee,
          signedDate,
          receivableBond,
          receivedBond,
          surplusReceivableBond,
        }}})
      },

      developping () {
        api.alert({
          title: '提示',
          msg: '功能开发中...',
        })
      }

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
