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

function openDialog () {
  api.openFrame({
    reload: true,
    name: 'drawer',
    bounces: false,
    bgColor: 'rgba(0,0,0,0,0)',
    url: 'widget://html/yjd_loan_signing/drawer.html',
    rect: {
      x: 0,
      y: 0,
      w: 'auto',
      h: 'auto'
    },
    pageParam: {
      id: '2'
    }
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

  $api.byId('sign').onclick = function () {
    console.log('object')
    openDialog()
  }

}