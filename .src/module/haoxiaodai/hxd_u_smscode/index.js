import './index.less'
import service from './service';
import Utils from '../../../utils';
import Router from '../../../router';
import {
  openTabLayout,
} from '../../../webview'
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
      count: 60,
      timer: null,
      smscode: "",
      isCounter: false,
      orderIds: JSON.parse(pageParam.orderIds),
      successList: JSON.parse(pageParam.successList),
      failList: JSON.parse(pageParam.failList),
      phone: pageParam.phone,
      hidePhone: pageParam.phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
    },
    methods: {
      handleChange(e) {
        this.smscode = e.target.value.slice(0, 6);
      },
      handleStartTimer() {
        if (this.timer) {
          this.timer = null;
        }
        this.isCounter = true;
        this.timer = setInterval(() => {
          if (this.count >= 1) {
            this.count = this.count - 1;
          } else {
            clearInterval(this.timer);
            this.isCounter = false;
            this.count = 60;
            this.timer = null;
          }
        }, 1000);
      },
      async handleGetSMSCode() {
        Utils.UI.showLoading('发送中...')
        try {
          const res = await service.postAgainSendSMSCode({
            phone: this.phone
          })
          if (res.code === 200) {
            this.handleStartTimer()
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(error.msg)
          }
        }
        Utils.UI.hideLoading()
      },
      async handleSubmit() {
        Utils.UI.showLoading('支用校验中')
        try {
          const res = await service.postVerify({
            phone: this.phone,
            orderIds: this.orderIds,
            verification: this.smscode.slice(0, 6)
          })
          if (res.code === 200) {
            this.successList = res.data.successList
            this.failList = this.failList.concat(res.data.failList)
            this.successTotalAmount = res.data.successTotalAmount

            // 跳转结果页
            Router.openPage({
              key: 'hxd_u_result',
              params: {
                pageParam: {
                  successList: JSON.stringify(this.successList),
                  failList: JSON.stringify(this.failList),
                  successTotalAmount: res.data.successTotalAmount
                }
              }
            })
          }
        } catch (error) {
          if(error && error.code === 1) {
            Utils.UI.toast('已提交，请等待审核结果')
            setTimeout(() => {
              openTabLayout(1)
            }, 1000);
          }else {
            if (error.msg) {
              Utils.UI.toast(error.msg)
            }
          }
        }
        Utils.UI.hideLoading()
      }
    },
    mounted() {
      this.handleStartTimer()
    }
  })
}