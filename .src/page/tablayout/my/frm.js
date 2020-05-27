import '../../../app.css'
import './frm.css'

import { openLeftPane, openMsgCenter, openBillList,
openMyLoan, openMyQuota, openMyProduct, openSettings,
openContactUs } from '../../../webview.js'
import { http } from '../../../config.js'

function getInfo () {
  http.post('/crpt-cust/identification/myinfo').then(res => {
    $api.byId('tel').innerHTML = res.data.phone
    if (res.data.msgcount && res.data.msgcount > 0) {
      $api.byId('msgcount').innerHTML = res.data.msgcount + '条新消息'
    } else {
      $api.byId('msgcount').innerHTML = ''
    }
    if (res.data.prodopencount && res.data.prodopencount > 0) {
      $api.byId('prodopencount').innerHTML = res.data.prodopencount
    } else {
      $api.byId('prodopencount').innerHTML = ''
    }
  }).catch(error => {
    api.toast({
      msg: error.msg || '获取信息失败'
    })
  })
}

apiready = function () {

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
    $api.byId('type').innerHTML = userType === '1' ? '个人账号' : '企业账号'
  }

  initPage()
  getInfo()
  api.addEventListener({
    name:'viewappear'
  }, function(ret, err){
    initPage()
    getInfo()
  })

  api.addEventListener({
    name: 'keyback'
  }, function(ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })

  document.querySelector('#msgcenter').onclick = function () {
    openMsgCenter()
  }

  document.querySelector('#billlist').onclick = function () {
    openBillList()
  }

  document.querySelector('#myLoan').onclick = function () {
    openMyLoan()
  }

  document.querySelector('#myquota').onclick = function () {
    openMyQuota()
  }

  document.querySelector('#myproduct').onclick = function () {
    openMyProduct()
  }

  document.querySelector('#settings').onclick = function () {
    openSettings()
  }

  document.querySelector('#contactus').onclick = function () {
    openContactUs()
  }


}
