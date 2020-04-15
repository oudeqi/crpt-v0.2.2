import '../../app.css'
import './win.css'

// apiready = function () {
//   api.addEventListener({
//     name: 'navitembtn'
//   }, (ret, err) => {
//     alert('点击了'+ret.index+'按钮');
//   })
// }

import { openMsgList, openRegLogin, openChangePwd } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  let userinfo = $api.getStorage('userinfo')
  let { name, userType, access_token } = userinfo

  function logout (cb) {
    http.delete(`/auth/token/${access_token}`).then(res => {
      cb()
    }).catch(error => {
      api.toast({
        msg: error.msg || '操作失败',
        location: 'middle'
      })
    })
  }

  document.querySelector('#logout').onclick = function () {
    api.confirm({
      title: '提示',
      msg: '确定要退出登录吗？',
      buttons: ['确定', '取消']
    }, (ret, err) => {
      if (ret.buttonIndex === 1) {
        logout(function () {
          api.toast({
            msg: '退出登录成功',
            duration: 2000,
            location: 'middle',
            global: true
          })
          $api.clearStorage()
          openRegLogin()
        })
      }
    })
  }

  document.querySelector('#changepwd').onclick = function () {
    openChangePwd()
  }


}
