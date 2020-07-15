import './index.less'
import service from './../hxd_apply/service'
import Router from '../../../router';
import Utils from '../../../utils';
import filter from './../../../utils/filter'
import { openTabLayout } from '../../../webview.js'
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
      productInfo: {}
    },
    computed: {
      creditAmountTn: function () {
        return filter.toThousands(this.productInfo.creditAmount * 10000)
      },
    },
    methods: {
      async handleGetProductDetail() {
        try {
          Utils.UI.showLoading('加载中')
          const res = await service.getProductInfo({ productId: pageParam.productId, query: 0 })
          if (res.code === 200) {
            this.productInfo = {
              productShort: '销',
              creditAmount: res.data.creditAmount,
              producName: res.data.productName,
              refusedReason: res.data.refusedReason
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
      handleToPageDetail() {
        Router.openPage({
          key: 'hxd_product_detail',
          params: {
            pageParam: {
              productId: pageParam.productId
            }
          }
        })
      },
      handleToProductList() {
        Router.openPage({
          key: 'com_product_list'
        })
      },
      handleToHome() {
        openTabLayout(0)
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

}