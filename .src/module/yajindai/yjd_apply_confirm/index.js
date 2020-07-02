import '../../../styles/common.less'
import './index.css'

const page = new Vue({
  el: '#app',
  data: {
    status: 1,
    textLabel: {
      1: {
        tips: "您已成功开通好消贷",
        label: "您的授信额度为",
        amount: "1,000,000",
        cbName: "查看产品详情"
      },
      0: {
        tips: "开通失败",
        label: "你失败了，这次你彻底申请失败了",
        amount: "0",
        cbName: "开通更多产品"
      }
    }
  },
  methods: {

  },
})

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  // alert(Vue)

}