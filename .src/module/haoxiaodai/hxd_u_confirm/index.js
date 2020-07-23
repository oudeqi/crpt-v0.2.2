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
      warehouseOrderlist: [{}],
      agreements: [],
      successList: [],
      failList: [],
      errorCount: 0,
      hasApply: false,
      processStatus: 1,
      maxErrorRetry: 20,
      status: pageParam.status || 11, // 用来区分是从单条入库单列表进来，还是从正常流程进来
      filter
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
            warehouseOrderNos: JSON.parse(pageParam.warehouseOrderNos),
            status: String(this.status),
            amount: pageParam.amount
          })
          if (res.code === 200) {
            this.warehouseOrderlist = res.data.warehouseOrderlist
            this.needApplyAmount = res.data.amount
            this.amount = filter.toThousands(res.data.amount)
            this.processStatus = res.data.warehouseOrderlist[0].processStatus
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
      async handleBtnClickConfirm() {
        Utils.UI.showLoading('正在提交')
        if(this.processStatus === 1) {
          try {
            const res = await service.postApply({
              productId: pageParam.productId,
              applyAmount: this.needApplyAmount,
              orderIds: this.warehouseOrderlist.map((item) => item.orderId)
            })
            if (res.code === 200) {
              // 申请提交成功，开始轮询金服返回结果
              this.processStatus = res.data.successList[0].processStatus
              this.handlePollingPostApply()
            } else {
              Utils.UI.hideLoading()
            }
          } catch (error) {
            if (error.msg) {
              Utils.UI.toast(`${error.code}: ${error.msg}`)
            }
            this.handleGetConfirmOrders()
            Utils.UI.hideLoading()
          }
        }else {
          this.handlePollingPostApply()
        }
      },
      // 轮询金服结果
      async handlePollingPostApply() {
        try {
          const res = await service.postQueryApply({
            orderIds: this.warehouseOrderlist.map((item) => item.orderId)
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
              setTimeout(() => {
                this.handlePollingPostApply()
              }, 1000);
            } else {
              // 2: 全部失败 终止轮询 跳到结果失败页
              Utils.UI.hideLoading()
              setTimeout(() => {
                Router.openPage({
                  key: 'hxd_u_result',
                  params: {
                    pageParam: {
                      // orderIds: this.successList.map((item) => item.orderId) || [],
                      successList: JSON.stringify(this.successList || []),
                      failList: JSON.stringify(this.failList || []),
                    }
                  }
                })
              }, 50);
            }
          }
        } catch (error) {
          // 如果服务本身报错或响应超时，只允许retry 5次
          if (this.errorCount <= this.maxErrorRetry) {
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
      handleDisagree() {
        this.isShowPop = false
      }
    },
    mounted() {
      this.handleGetConfirmOrders()
      Utils.UI.setRefreshHeaderInfo({
        success: () => {
          this.handleGetConfirmOrders()
          this.useAmount = ''
          setTimeout(() => {
            api.refreshHeaderLoadDone()
          }, 0);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        },
      })
    }
  })

}