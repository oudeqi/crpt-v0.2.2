import './index.less'
import service from './service';
import Utils from '../../../utils';



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
      isWarning: true,
      EBSOrders: [],
      availableAmount: 0, // 当前可用额度
      productId: pageParam.productId
    },
    methods: {
      async handleGetEBSOrders() {
        try {
          Utils.UI.showLoading('加载中')
          const res = await service.postQueryEBSOrders({ productId: this.productId })
          if(res.data) {
            this.EBSOrders = res.data.warehouseOrderlist
            this.availableAmount = res.data.availableAmount
          }
        } catch (error) {
          if(error.msg) {
            Utils.UI.toast(error.msg)
          }
        }
        Utils.UI.hideLoading()
      }
    },
    mounted() {
      this.handleGetEBSOrders()
    }
  })

}