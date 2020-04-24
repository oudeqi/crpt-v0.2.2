import '../../app.css'
import './frm.css'

import {
  openGerenLogin, openTodoAuthGeren,
  openTabLayout, openTodoAuthQiye
} from '../../webview.js'
import {
  http, openUIInput, loginSuccessCallback, isPhoneNo,
  phoneNoFormat, appLogin
} from '../../config.js'

apiready = function() {

  let form = {} // 表单数据
  let sendStatus = 'notsend' // notsend:未发送,sending:发送中,countdown:倒计时中
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交
  let pageParam = api.pageParam || {}
  let { tel, userType } = pageParam

  openUIInput($api.byId('code'), form, 'code', {
    placeholder: '请输入...',
    keyboardType: 'done',
    maxStringLength: 6
  })

  if (tel && isPhoneNo(tel)) {
    $api.byId('tel').innerHTML = phoneNoFormat(tel)
  } else {
    $api.byId('tel').innerHTML = ''
  }

  let apLoginBtn = document.querySelector('#ap_login')
  if (userType === 1) { // 个人登录
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
        api.toast({
          msg: error.msg || '发送验证码失败',
          location: 'middle'
        })
      })
    }
  }

  document.querySelector('#sendcode').onclick = function () {
    sendCode()
  }

  if(userType === 2) {
    apLoginBtn.onclick = function() {
      openGerenLogin({ userType: 2 })
    }
  }else {// 个人登录时隐藏账密登录提示
    apLoginBtn.style.display = 'none'
  }

  document.querySelector('#login').onclick = function () {
    if (submitStatus === 'notsubmit') {
      let code = form['code'][1]
      if (!code) {
        return api.toast({ msg: '请输入验证码' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('login'), 'loading')
      let body = {
        userType: userType, // 1个人用户登录，2企业用户登录
        username: tel,
        loginType: 2, // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
        verification: code,
        // password: tel, // 在验证码登录的时候，密码必须设置为手机号码
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
