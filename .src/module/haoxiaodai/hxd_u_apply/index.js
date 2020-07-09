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
      // isWarning: true,
      EBSOrders: [],
      amount: 0, // 当前可用额度
      useAmount: '', // 勾选用款金额
      productId: pageParam.productId
    },
    computed: {
      isWarning: function () {
        return this.amount < this.useAmount
      },
      amountTn: function () {
        return filter.toThousands(this.amount)
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
            this.amount = res.data.amount
          } else {
            this.EBSOrders = []
            this.amount = ''
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(error.msg)
          }
          this.EBSOrders = []
          this.amount = ''
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
            orderIds: _list,
            applyAmount: this.calculateUseAmount()
          })
          if (res.code === 200) {
            Utils.UI.toast('申请已提交')
            const successListStr = JSON.stringify(res.data.successList)
            const failListStr = JSON.stringify(res.data.failList)
            setTimeout(() => {
              Router.openPage({
                key: 'hxd_u_confirm',
                params: {
                  pageParam: {
                    productId: this.productId,
                    successListStr,
                    failListStr,
                    orderIds: JSON.stringify(res.data.successList.map(item => item.orderId))
                  }
                }
              })
            }, 50);
          } else {
            this.handleGetEBSOrders()
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(`${error.code} : ${error.msg}`)
          }
          if(error.code) {
            this.handleGetEBSOrders()
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