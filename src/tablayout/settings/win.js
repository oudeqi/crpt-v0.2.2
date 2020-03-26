
// apiready = function () {
//   api.addEventListener({
//     name: 'navitembtn'
//   }, (ret, err) => {
//     alert('点击了'+ret.index+'按钮');
//   })
// }

import { openMsgList, openRegLogin, openChangePwd } from '../../webview.js'

apiready = function () {

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

  document.querySelector('#changepwd').onclick = function () {
    openChangePwd()
  }


}
