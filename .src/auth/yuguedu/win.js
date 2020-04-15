import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload, openIDcardInfo, openTabLayout } from '../../webview.js'
import { http } from '../../config.js'

apiready = function() {

  let userinfo = $api.getStorage('userinfo')
  let { name, userType } = userinfo
  $api.byId('name').innerHTML = name

  function getPageData () {
    http.get('/crpt-credit/credit/credit/amount').then(res => {
      const data = res.data || {}
      $api.byId('edu').innerHTML = data.limitAmount || '****'
    }).catch(error => {
      api.toast({
        msg: error.msg || '获取数据失败'
      })
    })
  }

  getPageData()

  document.querySelector('#goIndex').onclick = function () {
    openTabLayout()
  }

}
