import '../../../styles/common.less'
import './contract-msg.css'
import AppDialog from '../../../common/component/app-dialog'

function vmInit () {
  return new Vue({
    el: '#app',
    components: {
      'app-dialog': AppDialog
    },
    data: function () {
      return {
        pageParam: api.pageParam || {},
        // countdown: {
        //   desc: '同意',
        //   seconds: 8,
        // }
      }
    },
    computed: {
      title: function () {
        return this.pageParam.title
      },
      countdown: function () {
        return this.pageParam.countdown || null
      },
    },
    mounted: function () {
      this.$refs.contract.innerHTML = $api.getStorage('yjd-loan-contract')
    },
    methods: {
      countdownCallback () {
        api.sendEvent({ name: 'contractagreed', extra: {}})
        api.closeFrame({ name: 'dialog' }) // 事件发送必须在关闭fram的前面
      },
      handleBtnClick (index) {
        api.closeFrame({ name: 'dialog' })
      },
      handleCloseClick () {
        api.closeFrame({ name: 'dialog' })
      }
    },
  })
}


apiready = function () {

  const vm = vmInit()

}