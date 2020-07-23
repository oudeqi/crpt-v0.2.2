import '../../../app.css'
import './win.css'

import { openTabLayout } from '../../../webview.js'

apiready = function() {

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      // 避免返回上一步后，信息还可以修改
      api.closeToWin({ name: 'html/todoauthgeren/win' })
      api.closeToWin({ name: 'html/todoauthqiye/win' })
      api.closeWin()
    }
  })
  api.addEventListener({
    name: 'keyback'
  }, function (ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
  })

  let pageParam = api.pageParam || {}
  let { status, title, message, tips } = pageParam // status: success error during

  if (status === 'success') {
    $api.byId('status') .innerHTML = `
      <div class="icon yes"></div>
      <div class="message">${message || '认证成功'}</div>
    `
  } else if (status === 'error') {
    $api.byId('status') .innerHTML = `
      <div class="icon no"></div>
      <div class="message">${message || '认证失败，请重试'}</div>
      <div class="tips">${tips || '请尽快联系您的业务人员'}</div>
    `
  } else {
    $api.byId('status') .innerHTML = `
      <div class="during"></div>
      <div class="message">${message || '人工审核中...'}</div>
    `
  }

  document.querySelector('#ok').onclick = function () {
    let userinfo = $api.getStorage('userinfo')
    let { userType } = userinfo
    let name = ''
    if (userType === '1') {
      name = 'html/todoauthgeren/win'
    } else {
      name = 'html/todoauthqiye/win'
    }
    api.closeToWin({ name })

  }

}
