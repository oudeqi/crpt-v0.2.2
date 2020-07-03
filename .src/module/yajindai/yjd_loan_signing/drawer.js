import '../../../styles/common.less'
import './drawer.css'
import AppDrawer from '../../../common/component/app-drawer'

function vmInit () {
  return new Vue({
    el: '#app',
    components: {
      'app-drawer': AppDrawer
    },
    data: function () {
      return {
        inputValue: '',
        code: new Array(6).fill('')
      }
    },
    mounted: function () {
      
    },
    watch: {
      inputValue: function (val) {
        let a = val.split('')
        if (a.length < 6) {
          a.push(...new Array(6 - a.length).fill(''))
        }
        a.splice(6)
        this.code = a
      }
    },
    methods: {
      onClose () {
        api.closeFrame({ name: 'drawer' })
      },
      handleInputClick () {
        this.$refs['hidden_ipt'].focus()
      },
    },
  })
}


apiready = function () {

  const vm = vmInit()




}