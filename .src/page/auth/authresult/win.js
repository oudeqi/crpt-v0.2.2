import '../../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload, openIDcardInfo, openTabLayout } from '../../../webview.js'

apiready = function() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let pageParam = api.pageParam || {}
  let { status, title, message } = pageParam // status: success error during

  if (status === 'success') {
    $api.byId('status') .innerHTML = `
      <div class="icon yes"></div>
      <div class="title">${message || '认证成功'}</div>
    `
  } else if (status === 'error') {
    $api.byId('status') .innerHTML = `
      <div class="icon no"></div>
      <div class="title">${message || '认证失败，请重试'}</div>
    `
  } else {
    $api.byId('status') .innerHTML = `
      <div class="during"></div>
      <div class="title">${message || '人工审核中...'}</div>
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
