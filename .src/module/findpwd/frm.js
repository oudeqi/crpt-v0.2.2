import '../../app.css'
import './frm.css'

import { openTabLayout, openGerenLogin } from '../../webview.js'
import { http, openUIInput, isPhoneNo } from '../../config.js'
import { Base64 } from 'js-base64'

apiready = function() {

  let form = {} // 表单数据
  let sendStatus = 'notsend' // notsend:未发送,sending:发送中,countdown:倒计时中
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  openUIInput($api.byId('tel'), form, 'tel', { placeholder: '请输入手机号码', keyboardType: 'number', maxStringLength: 11 })
  openUIInput($api.byId('code'), form, 'code', { placeholder: '短信验证码', keyboardType: 'next', maxStringLength: 6 })
  openUIInput($api.byId('pwd'), form, 'pwd', { placeholder: '请输入密码', keyboardType: 'next', inputType: 'password', maxStringLength: 16 })
  openUIInput($api.byId('repwd'), form, 'repwd', { placeholder: '请确认密码', keyboardType: 'done', inputType: 'password', maxStringLength: 16 })

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
      let tel = form['tel'][1]
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
        api.toast({
          msg: error.msg || '验证码发送失败',
          location: 'middle'
        })
        sendStatus = 'notsend'
        $api.byId('sendcode').innerHTML = '发送验证码'
      })
    }
  }

  document.querySelector('#submit').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!form['tel'][1]) {
        return api.toast({ msg: '请输入手机号码', location: 'middle' })
      }
      if (!isPhoneNo(form['tel'][1])) {
        return api.toast({ msg: '手机号码格式不正确', location: 'middle' })
      }
      if (!form['code'][1]) {
        return api.toast({ msg: '请输入验证码', location: 'middle' })
      }
      if (!form['pwd'][1]) {
        return api.toast({ msg: '请输入密码', location: 'middle' })
      }
      if (form['pwd'][1] !== form['repwd'][1]) {
        return api.toast({ msg: '两次密码输入不一致', location: 'middle' })
      }
      submitStatus = 'submitting'
      let body = {
        phone: form['tel'][1],
        password: Base64.encode(form['pwd'][1]),
        confirmPassword: Base64.encode(form['repwd'][1]),
        verification: form['code'][1]
      }
      $api.addCls($api.byId('submit'), 'loading')
      http.post('/crpt-cust/identification/getbackpassword', { body }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        api.toast({
          msg: '重置密码成功',
          location: 'middle',
          global: true
        })
        api.closeWin()
      }).catch(error => {
        api.toast({
          msg: error.msg || '操作失败',
          location: 'middle'
        })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
      })
    }
  }

}
