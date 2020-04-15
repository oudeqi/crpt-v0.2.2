import '../../app.css'
import './frm.css'

import { openLeftPane, openMsgCenter, openBillList,
openOrderList, openMyQuota, openMyProduct, openSettings,
openContactUs } from '../../webview.js'
import { http } from '../../config.js'

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

  api.addEventListener({
    name:'viewappear'
  }, function(ret, err){
    initPage()
    getInfo()
  })
  api.addEventListener({
    name: 'swiperight'
  }, function(ret, err){
    openLeftPane()
  })

  document.querySelector('#msgcenter').onclick = function () {
    openMsgCenter()
  }

  document.querySelector('#billlist').onclick = function () {
    openBillList()
  }

  document.querySelector('#orderlist').onclick = function () {
    openOrderList()
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
