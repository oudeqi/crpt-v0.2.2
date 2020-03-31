import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill, openTodoAuth } from '../../webview.js'

apiready = function(){
  api.parseTapmode()
  var header = $api.byId('header')
  $api.fixStatusBar(header)

  document.querySelector('#auth').onclick = function () {
    openTodoAuth()
  }

  document.querySelector('#logout').onclick = function () {
    api.confirm({
      title: '提示',
      msg: '确定要退出登录吗？',
      buttons: ['确定', '取消']
    }, (ret, err) => {
      if (ret.buttonIndex === 1) {
        openRegLogin()
        $api.clearStorage()
      }
    })
  }

  document.querySelector('#close').onclick = function () {
    api.closeWin()
  }

  api.addEventListener({
    name: 'swipeleft'
  }, function(ret, err){
    api.closeWin()
  });
};
