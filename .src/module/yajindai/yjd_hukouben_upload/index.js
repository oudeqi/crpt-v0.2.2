import '../../../styles/common.less'
import './index.css'

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {}
    },
    mounted: function () {
      
    },
    methods: {
      next () {
        console.log('zxczxczxczx===')
      }
    },
  })
}

apiready = function () {
  
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  const vm = vmInit()
  api.parseTapmode()
  $api.byId('next').onclick = function () {
    console.log('a')
    vm.next()
  }

}