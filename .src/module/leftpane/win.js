import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill, openTodoAuthGeren, openTodoAuthQiye } from '../../webview.js'

apiready = function(){

  let userinfo = $api.getStorage('userinfo')
  let { name, userType } = userinfo

  $api.byId('name').innerHTML = name
  $api.byId('version').innerHTML = `版本号 v${api.appVersion}`

  var header = $api.byId('header')
  $api.fixStatusBar(header)

  document.querySelector('#auth').onclick = function () {
    if (userType === '1') {
      openTodoAuthGeren()
    } else {
      openTodoAuthQiye()
    }
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
