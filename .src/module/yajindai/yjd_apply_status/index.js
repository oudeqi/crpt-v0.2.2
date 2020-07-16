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

function openDialog ({path, title, webViewH=400, titleH=60, tapClose=true}) {
  winWidth = api.winWidth
  api.require('dialogBox').webView({
    tapClose,
    path,
    texts: {
      title,
    },
    styles: {
      bg: '#fff',
      corner: 6,
      w: winWidth - 24 * 2,
      h: titleH + webViewH,
      title: {
        h: titleH,
        size: 16,
        color: 'rgba(48,49,51,1)'
      },
      upDividingLine: {
        width: 1,
        color: 'rgba(245,245,245,1)'
      },
      webView: {
        h: webViewH,
        bg: '#fff',
      },
      downDividingLine: {
        width: 1,
        color: 'rgba(245,245,245,1)'
      },
    }
  }, function(ret) {
    if (ret.eventType == 'left') {
      var dialogBox = api.require('dialogBox')
      dialogBox.close({
        dialogName: 'webView'
      })
    }
  })
}

function openDialog2 () {
  api.openFrame({
    reload: true,
    name: 'dialog',
    bounces: false,
    bgColor: 'rgba(0,0,0,0,0)',
    url: 'widget://html/yjd_apply_result/contract-msg.html',
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
  $api.byId('next').onclick = function () {
    vm.next()
  }

  $api.byId('msg').onclick = function () {
    openDialog2()
  }

}