import '../../app.css'
import './win.css'

import {
  openRegLogin, openBaseinfoFill, openCompanyInfo,
  openFaceAuth, openYuguEdu
} from '../../webview.js'
import { http } from '../../config.js'

apiready = function() {

  let userinfo = $api.getStorage('userinfo')
  let { userType } = userinfo

  document.querySelector('#companyInfo').onclick = function () {
    openCompanyInfo()
  }

  document.querySelector('#faceAuth').onclick = function () {
    openFaceAuth({
      userType: userType, // userType === '1' ? '个人账号' : '企业账号'
      title: '人脸认证'
    })
  }

  document.querySelector('#baseinfo').onclick = function () {
    openBaseinfoFill({
      userType: userType
    })
  }

  document.querySelector('#yuguedu').onclick = function () {
    openYuguEdu()
  }

  function getStatus () {
    http.get(`/crpt-cust/customer/query/authstatus`).then(res => {

    }).catch(error => {
      api.toast({
        msg: error.msg || '获取认证状态失败'
      })
    })
  }

  getStatus()


}
