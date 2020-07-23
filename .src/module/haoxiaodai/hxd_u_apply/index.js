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
      productId: pageParam.productId,
      selectedNumber: 0,
      filter
    },
    computed: {
      isWarning: function () {
        // 当选中入库单=1时，需要前端控制
        if (this.selectedNumber === 1) {
          let flag = false
          if (this.useAmount < 1000 || this.useAmount > this.amount) {
            flag = true
          }
          if (this.useAmount > this.EBSOrders.filter(item => item.isSelected)[0].wareAvailableAmount) {
            flag = true
          }
          return flag
        } else if (this.selectedNumber > 1) {
          // 多条入库单时，只校验入库单之和是否与总额度大小
          return !(this.useAmount < this.amount)
        } else {
          return false
        }
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
            this.useAmount = ''
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(error.msg)
          }
          this.EBSOrders = []
          this.amount = ''
          this.useAmount = ''
        }
        Utils.UI.hideLoading()
      },
      handleSelect(index) {
        // 如果选了之后是多条，则屏蔽修改框，否则打开修改框

        this.EBSOrders[index].isSelected = !this.EBSOrders[index].isSelected

        this.selectedNumber = this.EBSOrders.filter((item) => item.isSelected).length
        this.useAmount = this.calculateUseAmount()
        // this.useAmount = filter.toThousands(this.calculateUseAmount())
      },
      calculateUseAmount() {
        let _list = this.EBSOrders.filter((item) => item.isSelected)
        let m = _list.reduce((prev, item, i) => {
          return prev + item.wareAvailableAmount
        }, 0) || ''
        return Number(m).toFixed(2)
      },
      async postApplySubmit() {
        let _list = this.EBSOrders.filter((item) => item.isSelected).map((item) => item.orderId)
        try {
          Utils.UI.showLoading('提交中')
          const res = await service.postCustApply({
            productId: this.productId,
            orderIds: _list,
            applyAmount: this.useAmount
            // applyAmount: this.calculateUseAmount()
          })
          if (res.code === 200) {
            Utils.UI.toast('申请已提交')
            setTimeout(() => {
              Router.openPage({
                key: 'hxd_u_confirm',
                params: {
                  pageParam: {
                    productId: this.productId,
                    warehouseOrderNos: JSON.stringify(res.data.warehouseOrderNos),
                    amount: res.data.applyAmount
                  }
                }
              })
            }, 50);
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(`${error.code} : ${error.msg}`)
          }
          // 如果超额
          if (error.code === 7006) {
            let isOK = confirm('用款金额已超出可用额度，已为您调整用款信息')
          }
        }
        Utils.UI.hideLoading()
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
          api.refreshHeaderLoadDone()
          window.location.reload()
          // this.handleGetEBSOrders()
          // this.useAmount = ''
          // setTimeout(() => {
          //   api.refreshHeaderLoadDone()
          // }, 0);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        },
      })
      this.handleGetEBSOrders()
    }
  })

}