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
      return {}
    },
    mounted: function () {
      
    },
    methods: {
      onBtnClick (index) {
        api.closeFrame({ name: 'dialog' })
      }
    },
  })
}


apiready = function () {

  const vm = vmInit()

}