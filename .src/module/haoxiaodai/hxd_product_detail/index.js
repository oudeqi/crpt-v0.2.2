import './index.less'
import service from './../hxd_apply/service'
import Router from '../../../router';
import Utils from '../../../utils';
import filter from './../../../utils/filter'
import filterDict from '../../../utils/dict_filter/filter'


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
      creditStatus: 0,
      productInfo: {},
      duebillTypeMap: {},
      creditAmountStatusMap: {}
    },
    computed: {
      productTotalLimitTn: function () {
        return filter.toThousands(this.productInfo.productTotalLimit)
      },
      availableAmountTn: function () {
        return filter.toThousands(this.productInfo.availableAmount)
      },
    },
    methods: {
      async handleGetProductDetail() {
        try {
          Utils.UI.showLoading('加载中')

          // 还款方式码表
          const duebillTypeMap = await filterDict('duebillType')
          if (duebillTypeMap) {
            this.duebillTypeMap = duebillTypeMap
          }

          // 授信额度状态码表
          const creditAmountStatusMap = await filterDict('creditAmountStatus')
          if (creditAmountStatusMap) {
            this.creditAmountStatusMap = creditAmountStatusMap
          }

          const res = await service.getProductInfo({ productId: pageParam.productId })
          if (res.code === 200) {
            this.productInfo = {
              creditAmount: res.data.creditAmount,
              producName: res.data.productName,
              signContract: [res.data.signContract || {}],// 后端只返回了一个合同，并且是对象不是list
              exeInterest: res.data.exeInterest,
              opType: this.duebillTypeMap[res.data.opType],
              repayCycle: res.data.repayCycle,
              productTotalLimit: res.data.productTotalLimit,
              availableAmount: res.data.availableAmount,
              expireDate: res.data.expireDate,
              amountStatus: res.data.amountStatus,
              amountStatusText: this.creditAmountStatusMap[res.data.amountStatus],
            }
            this.creditStatus = res.data.creditStatus
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(`${error.code} : ${error.msg}`)
          }
        }
        Utils.UI.hideLoading()
      },
      handleToChangeLog() {
        Router.openPage({
          key: 'hxd_quota',
          params: {
            pageParam: {
              productId: pageParam.productId,
              productTotalLimit: filter.toThousands(this.productInfo.productTotalLimit)
            }
          }
        })
      },
      handleToAgreement(id) {
        Router.openPage({
          key: 'agreement',
          params: {
            pageParam: {
              id: id,
              type: 'pdf'
            }
          }
        })
      },
      handleToProductIntro() {
        Router.openPage({
          key: 'hxd_apply',
          params: {
            pageParam: {
              productId: pageParam.productId,
              hasApply: true
            }
          }
        })
      }
    },
    mounted() {
      Utils.UI.setRefreshHeaderInfo({
        success: () => {
          this.handleGetProductDetail()
          setTimeout(() => {
            api.refreshHeaderLoadDone()
          }, 0);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        },
      })
      this.handleGetProductDetail()
    }
  })
  // alert(Vue)

}