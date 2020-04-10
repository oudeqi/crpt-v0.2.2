import '../../app.css'
import './frm.css'

import {
  openReg, openGerenLogin, openQiyeLogin,
  openFindPwd, openSendCode, openTabLayout
} from '../../webview.js'
import { http, openUIInput, handleLoginSuccess } from '../../config.js'

apiready = function() {


  let form = {} // 表单数据
  let sendStatus = 'notsend' // notsend:未发送,sending:发送中,countdown:倒计时中
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交
  let pageParam = api.pageParam || {}
  let { tel, loginType } = pageParam

  openUIInput($api.byId('code'), form, 'code', {
    placeholder: '请输入...',
    keyboardType: 'done',
    maxStringLength: 6
  })

  $api.byId('tel').innerHTML = tel
  if (loginType === 'geren') {
    sendCode()
  } else {
    sendStatus = 'sending'
    countDown()
  }

  function countDown () {
    let second = 60
    sendStatus = 'countdown'
    $api.removeCls($api.byId('sendcode'), 'loading')
    $api.byId('sendcode').innerHTML = second + '秒后重试'
    let timer = setInterval(() => {
      if (second <= 0) {
        sendStatus = 'notsend'
        $api.byId('sendcode').innerHTML = '发送验证码'
        clearInterval(timer)
      } else {
        second--
        $api.byId('sendcode').innerHTML = second + '秒后重试'
      }
    }, 1000)
  }

  function sendCode () {
    if (sendStatus === 'notsend') {
      sendStatus = 'sending'
      $api.byId('sendcode').innerHTML = '正在发送中...'
      $api.addCls($api.byId('sendcode'), 'loading')
      http.post('/crpt-cust/sms/smsverificationcode', {
        body: {
          phone: tel
        }
      }).then(ret => {
        countDown()
      }).catch(error => {
        sendStatus = 'notsend'
        $api.removeCls($api.byId('sendcode'), 'loading')
        $api.byId('sendcode').innerHTML = '发送验证码'
        api.toast({ msg: '发送验证码失败' })
      })
    }
  }

  document.querySelector('#sendcode').onclick = function () {
    sendCode()
  }

  document.querySelector('#login').onclick = function () {
    // openTabLayout()
    if (submitStatus === 'notsubmit') {
      let code = form['code'][1]
      if (!code) {
        return api.toast({ msg: '请输入验证码' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('login'), 'loading')
      let body = {
        username: tel,
        loginType: 2, // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
        verification: code,
        password: tel, // 在验证码登录的时候，密码必须设置为手机号码
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
        api.toast({ msg: '登录失败' })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('login'), 'loading')
      })
    }
  }

}
