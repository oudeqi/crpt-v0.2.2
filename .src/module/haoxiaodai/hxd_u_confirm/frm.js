import '../../../styles/common.less'
import './frm.less'
import AppDrawer from '../../../common/component/app-drawer'

import http from '../../../http'
import numeral from 'numeral'
import service from './service';
import filter from './../../../utils/filter'
import Utils from '../../../utils';
import Router from '../../../router';
import smsService from '../hxd_u_smscode/service'

function vmInit() {
  const pageParam = api.pageParam
  return new Vue({
    el: '#app',
    components: {
      'app-drawer': AppDrawer
    },
    data: function () {
      return {
        // status: 1,
        agreements: pageParam.agreements,
        successList: pageParam.successList,
        failList: pageParam.failList,
        orderIds: pageParam.orderIds,
        // isFolder: true,
        // isShowPop: false,
        // amount: '',
        // needApplyAmount: '',
        // warehouseOrderlist: [{}],
        // agreements: [],
        // successList: [],
        // failList: [],
        // errorCount: 0,
        // hasApply: false,
        // processStatus: 1,
        // maxErrorRetry: 20,
        // status: pageParam.status || 11, // 用来区分是从单条入库单列表进来，还是从正常流程进来
        // pageSize: 100,
        // pageNo: 1,
        // total: '*',
        // list: [],
        // loading: false,
        // more: 'noData', // hasMore,noMore,noData
      }
    },
    mounted: function () {
      // console.log(this.id)
    },
    methods: {
      numeral: numeral,
      handleDisagree() {
        this.onClose()
      },
      async handleAgree() {
        if (this.agreements.length < 1) {
          Utils.UI.toast('服务异常')
          return
        }
        Utils.UI.showLoading('提交中')
        try {
          // 调用首次发短信接口，获取手机号
          const res = await smsService.postSendSMSCode()
          if (res.code === 200) {
            Utils.UI.hideLoading()
            Router.openPage({
              key: 'hxd_u_smscode',
              params: {
                pageParam: {
                  phone: res.data.phone,
                  orderIds: JSON.stringify(this.successList.map((item) => item.orderId)),
                  successList: JSON.stringify(this.successList || []),
                  failList: JSON.stringify(this.failList || []),
                }
              }
            })
          }
        } catch (error) {
          Utils.UI.hideLoading()
        }
      },
      handleToAgreement(id) {
        Router.openPage({
          key: 'pdf_agreement',
          params: {
            pageParam: {
              id,
              type: 'pdf'
            }
          }
        })
      },
      onClose() {
        api.closeFrame({ name: 'hxd_u_confirm_frm' })
      },
    },
  })
}


apiready = function () {

  const vm = vmInit()

}