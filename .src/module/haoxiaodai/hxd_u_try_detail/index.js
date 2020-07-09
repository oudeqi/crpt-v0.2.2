import './index.less'
import service from './service';
import filter from './../../../utils/filter'
import Utils from '../../../utils';
import Router from '../../../router';


apiready = function () {
  const pageParam = api.pageParam || {}
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  const page = new Vue({
    el: '#app',
    data: {
      dealDays: 90,
      plan: {},
      serviceMoney: 0
    },
    mounted() {
      this.handlePostPlan()
    },
    methods: {
      handleChange(event){
        this.dealDays = event.target.value
        this.handlePostPlan()
      },
      async handlePostPlan() {
        try {
          Utils.UI.showLoading('查询中')
          // const resInterest = await service.postBankInterest({ productId: pageParam.productId })
          const resInterest = {
            code: 200,
            data: {
              bankBackInterest: '0.00038',
              serviceMoney: 3.8
            }
          }
          if (resInterest.code === 200) {
            let bankBackInterest = resInterest.data.bankBackInterest
            let serviceMoney = resInterest.data.serviceMoney
            this.serviceMoney = serviceMoney
            const res = await service.postCalculatorPlan({
              dealDays: this.dealDays,
              bankBackInterest,
              needApplyAmount: pageParam.needApplyAmount
            })
            if(res.code === 200) {
              this.plan = {
                calRepayAmount: filter.toThousands(res.data.calRepayAmount),
                calServiceFee: filter.toThousands(res.data.calServiceFee)
              }
            }
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(error.msg)
          }
        }
        Utils.UI.hideLoading()
      },

    }
  })
}