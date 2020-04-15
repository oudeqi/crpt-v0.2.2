import '../../app.css'
import './frm.css'

import {
  openReg, openGerenLogin, openQiyeLogin,
  openFindPwd, openSendCode, openTabLayout
} from '../../webview.js'
import { http, openUIInput, isPhoneNo, handleLoginSuccess } from '../../config.js'

apiready = function() {

  // 表单数据
  let form = {}
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

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
        loginType: 'geren'
      })
    } else {
      api.toast({ msg: '手机号码格式不正确' })
    }
  }

  document.querySelector('#register').onclick = function () {
    openReg()
  }

  document.querySelector('#login').onclick = function () {
    // openTabLayout()
    if (submitStatus === 'notsubmit') {
      if (!form['tel'][1]) {
        return api.toast({ msg: '请输入手机号码' })
      }
      if (!form['pwd'][1]) {
        return api.toast({ msg: '请输入密码' })
      }
      submitStatus = 'submitting'
      let body = {
        userType: 1, // 1个人用户登录，2企业用户登录
        username: form['tel'][1],
        loginType: 1, // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
        // verification: form['code'][1],
        password: form['pwd'][1],
        loginDevice: api.deviceId, // 客户手机设备号(android-imei,IOS-??)
        ipAddress: '',
        latitude: '',
        longitude: '',
        terminal_version: api.systemVersion, // 系统终端版本
        location: '', // 最近登录地点
        grant_type: 'password', // 固定传password
        scope: 'app', // 固定传app
        client_id: 'client', // client
        client_secret: 'secret', // 固定传secret
      }
      $api.addCls($api.byId('login'), 'loading')
      http.post('/auth/oauth/token', {
        values: body
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        } 
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('login'), 'loading')
        api.toast({
          msg: '登录成功',
          location: 'middle',
          global: true
        })
        handleLoginSuccess(ret)
        openTabLayout()
      }).catch(error => {
        api.toast({
          msg: error.msg || '登录失败',
          location: 'middle'
        })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('login'), 'loading')

      })
    }
  }

}
