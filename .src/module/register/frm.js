import '../../app.css'
import './frm.css'

import { http, openUIInput, resetUIInputPosi } from '../../config.js'


apiready = function() {

  const UIInput = api.require('UIInput')

  // 表单数据
  let form = {}
  let type = 'geren'
  let sendStatus = 'notsend' // notsend:未发送,sending:发送中,countdown:倒计时中
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  openUIInput($api.byId('tel'), form, 'tel', { placeholder: '请输入手机号码', keyboardType: 'number', maxStringLength: 11 })
  openUIInput($api.byId('code'), form, 'code', { placeholder: '短信验证码', keyboardType: 'next', maxStringLength: 4 })
  openUIInput($api.byId('pwd'), form, 'pwd', { placeholder: '请输入密码', keyboardType: 'next', inputType: 'password', maxStringLength: 16 })
  openUIInput($api.byId('repwd'), form, 'repwd', { placeholder: '请输入密码', keyboardType: 'done', inputType: 'password', maxStringLength: 16 })

  function resetInputPosi () {
    resetUIInputPosi($api.byId('tel'), form['tel'][0])
    resetUIInputPosi($api.byId('code'), form['code'][0])
    resetUIInputPosi($api.byId('pwd'), form['pwd'][0])
    resetUIInputPosi($api.byId('repwd'), form['repwd'][0])
  }

  function radioOnChange () {
    if (this.dataset.type === 'geren') {
      $api.byId('companyName').style.display = 'none'
      UIInput.hide({id: form['name'][0]})
      resetInputPosi()
    } else {
      $api.byId('companyName').style.display = 'block'
      setTimeout(() => {
        if (form['name']) {
          UIInput.show({id: form['name'][0]})
        } else {
          openUIInput($api.byId('name'), form, 'name', {
            placeholder: '请输入...',
            isCenterVertical: false,
            maxRows: 2,
            keyboardType: 'next',
            maxStringLength: 40
          })
        }
      }, 150)
      resetInputPosi()
    }
  }

  document.querySelector('#geren').onclick = radioOnChange
  document.querySelector('#qiye').onclick = radioOnChange

  document.querySelector('#agreement').onclick = function () {
    api.alert({
      title: '消息',
      msg: '功能开发中...',
    })
  }

  function countDown () {
    let second = 6
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
      sendStatus = 'sending'
      $api.byId('sendcode').innerHTML = '正在发送中'
      setTimeout(() => {
        sendStatus = 'countdown'
        countDown()
      }, 1000)
      // http.post('/xxx').then(ret => {
      //   sendStatus = 'countdown'
      //   countDown()
      // }).catch(error => {
      //   sendStatus = 'notsend'
      // })
    }
  }

  document.querySelector('#submit').onclick = function () {
    // alert(JSON.stringify(form))
    if (submitStatus === 'notsubmit') {
      submitStatus = 'submitting'
      $api.addCls($api.byId('submit'), 'loading')
      setTimeout(() => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        api.toast({
          msg: '注册成功',
          location: 'middle',
          global: true
        })
        api.closeWin()
      }, 1000)
      // http.post('/xxx').then(ret => {
      //   api.toast({
      //     msg: '注册成功',
      //     location: 'middle',
      //     global: true
      //   })
      //   api.closeWin()
      // }).catch(error => {
      //
      // }).finally(() => {
      //   submitStatus = 'notsubmit'
      //   $api.removeCls($api.byId('submit'), 'loading')
      // })
    }
  }




}
