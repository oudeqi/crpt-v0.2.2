import '../../../app.css'
import './index.css'

import { openReg, openFindPwd, openSendCode } from '../../../webview.js'
import { http, isPhoneNo, loginSuccessCallback, appLogin } from '../../../config.js'

apiready = function() {

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交
  //  根据传参确定登录接口的userType类型和是否隐藏
  const { userType } = api.pageParam || {}

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
  if(userType === 2) {
    document.querySelector('#tel_login').style.display = 'none'
    $api.byId('tit').innerHTML = '企业登录'
  } else {
    $api.byId('tit').innerHTML = '个人登录'
  }
  document.querySelector('#forget').onclick = function () {
    openFindPwd()
  }

  document.querySelector('#tel_login').onclick = function () {
    let tel = $api.byId('tel').value.trim()
    if (!tel) {
      api.toast({ msg: '请输入手机号码', location: 'middle' })
    } else if (isPhoneNo(tel)) {
      openSendCode({ tel, userType: 1 })
    } else {
      api.toast({ msg: '手机号码格式不正确', location: 'middle' })
    }
  }

  document.querySelector('#register').onclick = function () {
    openReg()
  }

  document.querySelector('#login').onclick = function () {
    if (submitStatus === 'notsubmit') {
      let tel = $api.byId('tel').value.trim()
      let pwd = $api.byId('pwd').value.trim()
      if (!tel) {
        return api.toast({ msg: '请输入手机号码', location: 'middle' })
      }
      if (!pwd) {
        return api.toast({ msg: '请输入密码', location: 'middle' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('login'), 'loading')
      let body = {
        userType: userType || 1, // 1个人用户登录，2企业用户登录
        username: tel,
        loginType: 1, // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
        // verification: code,
        password: pwd
      }
      appLogin(body, function (userinfo) {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('login'), 'loading')
        loginSuccessCallback(userinfo)
      }, function (error) {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('login'), 'loading')
        $api.clearStorage()
      })
    }
  }

}
