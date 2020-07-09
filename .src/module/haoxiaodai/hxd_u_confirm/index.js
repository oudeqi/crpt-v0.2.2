import './index.less'
import service from './service';
import filter from './../../../utils/filter'
import Utils from '../../../utils';
import Router from '../../../router';
import smsService from '../hxd_u_smscode/service'

apiready = function () {
  const pageParam = api.pageParam || {}
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  // api.closeWin({
  //   name: 'hxd_u_apply'
  // })
  const page = new Vue({
    el: '#app',
    data: {
      status: 1,
      isFolder: true,
      isShowPop: false,
      amount: '',
      needApplyAmount: '',
      warehouseOrderlist: [],
      agreements: [],
      successList: pageParam.successListStr ? JSON.parse(pageParam.successListStr) : [],
      failList: pageParam.failListStr ? JSON.parse(pageParam.failListStr) : [],
      errorCount: 0
    },
    methods: {
      handleFolder() {
        this.isFolder = !this.isFolder;
      },
      async handleGetConfirmOrders() {
        // let ids = ['1280041840938172417', '1280032548025647106']
        try {
          Utils.UI.showLoading('查询中')
          const res = await service.postConfirmOrders({
            orderIds: JSON.parse(pageParam.orderIds)
          })
          if (res.code === 200) {
            this.warehouseOrderlist = res.data.warehouseOrderlist
            this.needApplyAmount = res.data.amount
            this.amount = filter.toThousands(res.data.amount)
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(error.msg)
          }
        }
        Utils.UI.hideLoading()
      },
      handleOpenPop() {
        this.isShowPop = true
      },
      handleBtnClickConfirm() {
        Utils.UI.showLoading('正在提交')
        this.handlePollingPostApply()
      },
      // 轮询金服结果
      async handlePollingPostApply() {
        try {
          const res = await service.postApply({
            orderIds: JSON.parse(pageParam.orderIds)
          })
          if (res.code === 200) {
            const { successFlag } = res.data
            //  1: 轮询单条或全部成功已返回结果
            if (successFlag === 1) {
              // 更新successList，并join failList
              this.successList = res.data.successList
              this.failList = this.failList.concat(res.data.failList)

              // todo 弹起合同弹框，查询合同
              this.handleOpenPop()
              const orderIds = this.successList.map((item, i) => {
                return item.orderId
              })
              Utils.UI.hideLoading()
              this.agreements = res.data.successList
              // this.handlePostContractList(orderIds)
            } else if (successFlag === 0) {
              // 0: 继续轮询
              this.handlePollingPostApply()
            } else {
              // 2: 全部失败 终止轮询 跳到结果失败页
              Utils.UI.hideLoading()
              setTimeout(() => {
                Router.openPage({
                  key: 'hxd_u_result',
                  params: {
                    pageParam: {
                      successListStr: JSON.stringify(this.successList),
                      failListStr: JSON.stringify(this.failList),
                    }
                  }
                })
              }, 50);
            }
          }
        } catch (error) {
          // 如果服务本身报错或响应超时，只允许retry 5次
          if (this.errorCount <= 4) {
            this.handlePollingPostApply()
            this.errorCount = this.errorCount + 1
          } else {
            Utils.UI.hideLoading()
            Utils.UI.toast('查询超时')
          }
        }
      },
      // 查询合同
      async handlePostContractList(orderIds) {
        try {
          const res = await service.postContractList({
            orderIds
          })
          if (res.code === 200) {
            this.agreements = res.data
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(error.msg)
          }
        }
      },
      handleClosePop() {
        this.isShowPop = false
      },
      async handleToUseTry() {
        Router.openPage({
          key: 'hxd_u_try_detail',
          params: {
            pageParam: {
              productId: pageParam.productId,
              needApplyAmount: this.needApplyAmount
            }
          }
        })
      },
      handleToAgreement(id) {
        Router.openPage({
          key: 'agreement',
          params: {
            pageParam: {
              id,
              type: 'pdf'
            }
          }
        })
      },
      async handleAgree() {
        if(this.agreements.length < 1) {
          Utils.UI.toast('服务异常')
          return
        }
        Utils.UI.showLoading('提交中')
        try {
          // 调用首次发短信接口，获取手机号
          const res = await smsService.postSendSMSCode()
          if(res.code === 200) {
            Utils.UI.hideLoading()
            Router.openPage({
              key: 'hxd_u_smscode',
              params: {
                pageParam: {
                  phone: res.data.phone,
                  orderIds: JSON.stringify(this.successList.map((item) => item.orderId)),
                  successListStr: JSON.stringify(this.successList),
                  failListStr: JSON.stringify(this.failList),
                }
              }
            })
          }
        } catch (error) {
          Utils.UI.hideLoading()
        }
      },
      handleDisagree() {
        this.isShowPop = false
      }
    },
    mounted() {
      this.handleGetConfirmOrders()
    }
  })

}