import './index.less'
import Router from '../../../router'
import filter from '../../../utils/filter'
import http from '../../../http/index.js'
import Utils from '../../../utils'

apiready = function () {
  const page = new Vue({
    el: '#app',
    data: {
      status: 3,
      isShowPop: false,
      filter,
      principal: '',
      tips: '',
      totalAmount: 0,
      tirialData: {},
      pageParam: api.pageParam || {},
      cannotClick: true
    },
    computed:{
      principalTn () {
        this.cannotClick = true
        return filter.toThousands(this.principal)
      }
    },
    methods: {
      handleChange (e) {
        this.principal = e.target.value.replace(/,/g, '')
        if (Number(this.principal) < 200) {
          this.tips = '最低还款本金200元，请重新输入'
        } else if (Number(this.principal) > this.totalAmount) {
          this.tips = '超出剩余待还本金，请重新输入'
        } else {
          this.tips = ''
        }
      },
      async retialAmount () { // 获取试算结果
        Utils.UI.showLoading('加载中')
        try {
          // this.pageParam.loanId = '12'
          const res = await http.get(`/crpt-credit/credit/yjd/repay/try?repayPrincipal=${this.principal}&loanId=${this.pageParam.loanId}&planId=${this.pageParam.planId}`)
          this.tirialData = res.data
          this.cannotClick = false
          Utils.UI.hideLoading()
        } catch (err) {
          Utils.UI.hideLoading()
        }
      },
      async repayAll () { // 获取全部金额
        Utils.UI.showLoading('加载中')
        try {
          // this.pageParam.loanId = '12'
          const res = await http.get('/crpt-credit/credit/yjd/repay/remain/principal?loanId=' + this.pageParam.loanId)
          this.principal = res.data
          this.totalAmount = res.data
          Utils.UI.hideLoading()
        } catch (err) {
          Utils.UI.hideLoading()
        }
      },
      handleOpenDetailFrame() {
        // Router.openPage({key: 'hxd_r_try_detail'})
        // api.openFrame({
        //   name: "hxd_r_try_frm",
        //   url: "widget://html/hxd_r_try/frm.html",
        //   // animation: {
        //   //   type: 'fade',
        //   //   duration: 300
        //   // },
        //   // background: rgba(48, 49, 51, 0.6);
        //   bgColor: 'rgba(48, 49, 51, 0.6);',
        //   rect: {
        //     // x: 0,
        //     // y: 0,
        //     // w: "auto",
        //     // h: "auto"
        //     x: 0,
        //     y: 0,
        //     w: 'auto',
        //     h: 'auto'
        //   },
        //   bounces: true,
        //   opaque: true,
        //   vScrollBarEnabled: false,
        //   scrollEnabled: false,
        //   fixedOn: api.frameName,
        //   fixed: true
        // });
        
      },
      async handleOpenPop() { // 确认还款
        if (!this.cannotClick) {
          const sendJson = this.tirialData
          sendJson.loanId = this.pageParam.loanId
          sendJson.planId = this.pageParam.planId
          Utils.UI.showLoading('还款提交中')
          try {
            const res = await http.post('/crpt-credit/credit/yjd/repay/affirm', {body: sendJson})
            Utils.UI.hideLoading()
            Router.openPage({key: 'com_repay_result'})
          } catch (err) {
            Utils.UI.hideLoading()
          }
        }
        // this.isShowPop = true
      },
      handleClosePop() {
        this.isShowPop = false
      }
    },
    mounted() {
      this.repayAll()
    }
  })
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  // alert(Vue)

}