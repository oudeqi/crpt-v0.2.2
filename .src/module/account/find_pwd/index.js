import '../../../app.css'
import './index.css'

import { http, isPhoneNo } from '../../../config.js'
import { Base64 } from 'js-base64'

apiready = function() {

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  let sendStatus = 'notsend' // notsend:未发送,sending:发送中,countdown:倒计时中
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  function countDown () {
    let second = 60
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

  document.querySelector('#sendcode').onclick = function () {
    if (sendStatus === 'notsend') {
      let tel = $api.byId('tel').value.trim()
      if (!tel) {
        return api.toast({ msg: '请输入手机号码', location: 'middle' })
      }
      if (!isPhoneNo(tel)) {
        return api.toast({ msg: '手机号码格式不正确', location: 'middle' })
      }
      sendStatus = 'sending'
      $api.byId('sendcode').innerHTML = '正在发送中...'
      http.post('/crpt-cust/sms/smsverificationcode', {
        body: {
          phone: tel
        }
      }).then(ret => {
        sendStatus = 'countdown'
        countDown()
      }).catch(error => {
        api.toast({ msg: error.msg || '验证码发送失败', location: 'middle' })
        sendStatus = 'notsend'
        $api.byId('sendcode').innerHTML = '发送验证码'
      })
    }
  }

  document.querySelector('#submit').onclick = function () {
    if (submitStatus === 'notsubmit') {
      let tel = $api.byId('tel').value.trim()
      let code = $api.byId('code').value.trim()
      let pwd = $api.byId('pwd').value.trim()
      let repwd = $api.byId('repwd').value.trim()
      if (!tel) {
        return api.toast({ msg: '请输入手机号码', location: 'middle' })
      }
      if (!isPhoneNo(tel)) {
        return api.toast({ msg: '手机号码格式不正确', location: 'middle' })
      }
      if (!code) {
        return api.toast({ msg: '请输入验证码', location: 'middle' })
      }
      if (!pwd) {
        return api.toast({ msg: '请输入密码', location: 'middle' })
      }
      if (pwd !== repwd) {
        return api.toast({ msg: '两次密码输入不一致', location: 'middle' })
      }
      submitStatus = 'submitting'
      let body = {
        phone: tel,
        password: Base64.encode(pwd),
        confirmPassword: Base64.encode(repwd),
        verification: code
      }
      $api.addCls($api.byId('submit'), 'loading')
      http.post('/crpt-cust/identification/getbackpassword', { body }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        api.toast({ msg: '重置密码成功', location: 'middle', global: true })
        api.closeWin()
      }).catch(error => {
        api.toast({ msg: error.msg || '操作失败', location: 'middle' })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
      })
    }
  }

}
