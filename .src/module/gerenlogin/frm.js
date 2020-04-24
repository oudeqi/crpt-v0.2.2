import '../../app.css'
import './frm.css'

import {
  openReg, openTodoAuthGeren, openFindPwd,
  openSendCode, openTabLayout, openTodoAuthQiye
} from '../../webview.js'
import { http, openUIInput, isPhoneNo, loginSuccessCallback, appLogin } from '../../config.js'

apiready = function() {
  // 表单数据
  let form = {}
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交
  //  根据传参确定登录接口的userType类型和是否隐藏
  const params = api.pageParam
  openUIInput($api.byId('tel'), form, 'tel', {
    placeholder: '请输入手机号码',
    keyboardType: 'number',
    maxStringLength: 11
  })
  openUIInput($api.byId('pwd'), form, 'pwd', {
    placeholder: '请输入密码',
    keyboardType: 'done',
    inputType: 'password',
    maxStringLength: 16
  })

  // document.querySelector('#switch').onchange = function () {
  //   let lockIcon = $api.byId('lockIcon')
  //   if (this.checked) {
  //     $api.addCls(lockIcon, 'aui-icon-unlock')
  //     $api.removeCls(lockIcon, 'aui-icon-lock')
  //     renderPwd('text')
  //   } else {
  //     $api.addCls(lockIcon, 'aui-icon-lock')
  //     $api.removeCls(lockIcon, 'aui-icon-unlock')
  //     renderPwd('password')
  //   }
  // }
  //  企业登录，屏蔽短信验证码按钮
  if(params.userType === 2) {
    document.querySelector('#tel_login').style.display = 'none'
  }
  document.querySelector('#forget').onclick = function () {
    openFindPwd()
  }

  document.querySelector('#tel_login').onclick = function () {
    let tel = form['tel'][1]
    if (!tel) {
      api.toast({ msg: '请输入手机号码' })
    } else if (isPhoneNo(tel)) {
      openSendCode({
        tel,
        userType: 1
      })
    } else {
      api.toast({ msg: '手机号码格式不正确' })
    }
  }

  document.querySelector('#register').onclick = function () {
    openReg()
  }

  document.querySelector('#login').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!form['tel'][1]) {
        return api.toast({ msg: '请输入手机号码' })
      }
      if (!form['pwd'][1]) {
        return api.toast({ msg: '请输入密码' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('login'), 'loading')
      let body = {
        userType: params.userType || 1, // 1个人用户登录，2企业用户登录
        username: form['tel'][1],
        loginType: 1, // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
        // verification: form['code'][1],
        password: form['pwd'][1]
      }
      appLogin(body, function (userinfo) {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('login'), 'loading')
        loginSuccessCallback(userinfo)
      }, function (error) {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('login'), 'loading')
      })
    }
  }

}
