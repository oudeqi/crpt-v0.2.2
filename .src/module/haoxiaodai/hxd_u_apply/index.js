import './index.less'
import service from './service';
import filter from './../../../utils/filter'
import Utils from '../../../utils';
import Router from '../../../utils/router';

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
      // isWarning: true,
      EBSOrders: [],
      availableAmount: 0, // 当前可用额度
      useAmount: '', // 勾选用款金额
      productId: pageParam.productId
    },
    computed: {
      isWarning: function () {
        return this.availableAmount < this.useAmount
      },
      availableAmountTn: function () {
        return filter.toThousands(this.availableAmount)
      },
      useAmountTn: function () {
        return filter.toThousands(this.useAmount)
      },
    },
    methods: {
      async handleGetEBSOrders() {
        try {
          Utils.UI.showLoading('加载中')
          const res = await service.postQueryEBSOrders({ productId: this.productId })
          if (res.data) {
            this.EBSOrders = res.data.warehouseOrderlist.map((item) => {
              return {
                ...item,
                isSelected: false
              }
            })
            this.availableAmount = res.data.availableAmount
          } else {
            this.EBSOrders = []
            this.availableAmount = ''
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(error.msg)
          }
          this.EBSOrders = []
          this.availableAmount = ''
        }
        Utils.UI.hideLoading()
      },
      handleSelect(index) {
        this.EBSOrders[index].isSelected = !this.EBSOrders[index].isSelected
        this.useAmount = filter.toThousands(this.calculateUseAmount())
      },
      calculateUseAmount() {
        let _list = this.EBSOrders.filter((item) => item.isSelected)
        return _list.reduce((prev, item, i) => {
          return prev + item.wareAvailableAmount
        }, 0) || ''
      },
      async postApplySubmit() {
        let _list = this.EBSOrders.filter((item) => item.isSelected).map((item) => item.orderId)
        try {
          Utils.UI.showLoading('提交中')
          const res = await service.postApply({
            productId: this.productId,
            orderIds: _list
          })
          if (res.code === 200) {
            alert('ok')
            Router.openPage({
              key: 'hxd_u_confirm',
              params: {
                pageParam: { productId: this.productId }
              }
            })
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(`${error.code} : ${error.msg}`)
          }
        }
        Utils.UI.hideLoading('')
      },
      handleSubmit() {
        let _list = this.EBSOrders.filter((item) => item.isSelected)
        if (_list.length <= 0) {
          Utils.UI.toast('请选择入库单')
          return
        }
        this.postApplySubmit()
      },
      handleChange(event) {
        this.useAmount = event.target.value.replace(/,/g, '')
      }
    },
    mounted() {
      api.parseTapmode()

      Utils.UI.setRefreshHeaderInfo({
        success: () => {
          this.handleGetEBSOrders()
          setTimeout(() => {
            api.refreshHeaderLoadDone()
          }, 0);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        },
      })
      this.handleGetEBSOrders()
    }
  })

}