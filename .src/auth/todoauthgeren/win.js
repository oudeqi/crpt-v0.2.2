import '../../app.css'
import './win.css'

import {
  openRegLogin, openBaseinfoFill, openCompanyInfo,
  openFaceAuth, openYuguEdu, openIDcardUpload
} from '../../webview.js'

apiready = function() {

  let userinfo = $api.getStorage('userinfo')
  let { userType } = userinfo

  document.querySelector('#realAuth').onclick = function () {
    openIDcardUpload()
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


}
