import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill, openTodoAuthGeren, openTodoAuthQiye } from '../../webview.js'
import { http } from '../../config.js'
import { version } from '../../../package.json'

apiready = function(){

  let userinfo = {}
  let name = ''
  let userType = ''
  let access_token = ''

  function initPage () {
    userinfo = $api.getStorage('userinfo')
    name = userinfo.name
    userType = userinfo.userType
    access_token = userinfo.access_token
    $api.byId('name').innerHTML = name
    $api.byId('version').innerHTML = `版本号 v${version}`
  }
  initPage()

  api.addEventListener({
    name: 'swipeleft'
  }, function(ret, err){
    api.closeWin()
  })

  var header = $api.byId('header')
  $api.fixStatusBar(header)

  document.querySelector('#auth').onclick = function () {
    if (userType === '1') {
      openTodoAuthGeren()
    } else {
      openTodoAuthQiye()
    }
  }

  function logout (cb) {
    http.delete(`/auth/token/${access_token}`).then(res => {
      $api.removeCls($api.byId('logout'), 'loading')
      cb()
    }).catch(error => {
      api.toast({
        msg: error.msg || '操作失败',
        location: 'middle'
      })
      $api.removeCls($api.byId('logout'), 'loading')
    })
  }

  document.querySelector('#logout').onclick = function () {
    api.confirm({
      title: '提示',
      msg: '确定要退出登录吗？',
      buttons: ['确定', '取消']
    }, (ret, err) => {
      if (ret.buttonIndex === 1) {
        $api.addCls($api.byId('logout'), 'loading')
        logout(function () {
          api.toast({
            msg: '退出登录成功',
            duration: 2000,
            location: 'middle',
            global: true
          })
          let windows = api.windows()
          if (windows && windows.length > 0) { // 退出登录关闭部分win解决重新登录部分界面不刷新数据问题
            windows.forEach(win => {
              // 关闭非root、非登录注册页
              if (win.name !== 'root' && win.name !== 'html/reglogin/win') {
                api.closeWin({
                  name: win.name
                })
              }
            })
          }
          $api.clearStorage()
          openRegLogin()
        })
      }
    })
  }

  document.querySelector('#close').onclick = function () {
    api.closeWin()
  }

}
