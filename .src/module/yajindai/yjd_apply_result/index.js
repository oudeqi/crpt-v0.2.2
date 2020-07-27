import '../../../styles/common.less'
import './index.css'

import { openTabLayout } from '../../../webview'

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        pageParam: api.pageParam || {},
        currentSeconds: 3
      }
    },
    computed: {
      status: function () { // 申请状态
        return this.pageParam.status || 'success'
      }
    },
    mounted: function () {
      if (this.status === 'success') {
        this.countDown()
      }
    },
    methods: {
      countDown () {
        let timer = setInterval(() => {
          this.currentSeconds--
          if (this.currentSeconds === 0) {
            clearInterval(timer)
            setTimeout(() => {
              openTabLayout(1)
            }, 1000)
          }
        }, 1000)
      }
    },
  })
}

apiready = function () {
  
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret) {
    if (ret.type === 'left') {
      openTabLayout(1)
      api.closeWin()
    }
  })

  const vm = vmInit()

}