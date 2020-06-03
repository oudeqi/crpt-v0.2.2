import '../../../app.css'
import './frm.css'

import { openTabLayout, openTodoAuthGeren, openTodoAuthQiye, openAgreement } from '../../../webview.js'
import {
  http, openUIInput, resetUIInputPosi,
  loginSuccessCallback, appLogin,
  getNodeProtocolFromStorage, getProtocolFromNode
} from '../../../config.js'

apiready = function() {

  const UIInput = api.require('UIInput')

  let form = {} // 表单数据
  let type = 'geren' // qiye
  let sendStatus = 'notsend' // notsend:未发送,sending:发送中,countdown:倒计时中
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  openUIInput($api.byId('tel'), form, 'tel', { placeholder: '请输入手机号码', keyboardType: 'number', maxStringLength: 11 })
  openUIInput($api.byId('code'), form, 'code', { placeholder: '短信验证码', keyboardType: 'next', maxStringLength: 6 })
  openUIInput($api.byId('pwd'), form, 'pwd', { placeholder: '请输入密码', keyboardType: 'next', inputType: 'password', maxStringLength: 16 })
  openUIInput($api.byId('repwd'), form, 'repwd', { placeholder: '请确认密码', keyboardType: 'done', inputType: 'password', maxStringLength: 16 })

  function resetInputPosi () {
    resetUIInputPosi($api.byId('tel'), form['tel'][0])
    resetUIInputPosi($api.byId('code'), form['code'][0])
    resetUIInputPosi($api.byId('pwd'), form['pwd'][0])
    resetUIInputPosi($api.byId('repwd'), form['repwd'][0])
  }

  function radioOnChange () {
    if (this.dataset.type === 'geren') {
      showProtocol(1)
      $api.byId('companyName').style.display = 'none'
      UIInput.hide({id: form['name'][0]})
      type = 'geren'
      resetInputPosi()
    } else {
      showProtocol(2)
      $api.byId('companyName').style.display = 'block'
      type = 'qiye'
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

  function showProtocol (type) {
    let node = getNodeProtocolFromStorage(1)
    if (!node) {
      api.toast({ msg: '协议不存在', location: 'middle' })
      return
    }
    let tyeeNode = getProtocolFromNode(node, type)
    if (!tyeeNode) {
      api.toast({ msg: '协议不存在', location: 'middle' })
      return
    }
    let tpl = tyeeNode.map(item => {
      return `<span>《</span><strong tapmode="active" data-name="${item.protocolName}" data-id="${item.protocolFileId}">${item.protocolName}</strong><span>》</span>`
    })
    $api.byId('agreement').innerHTML = tpl.join('，')
  }

  showProtocol(1) // protocolType 1-个人，2-企业，3-通用
  document.querySelector('#agreement').onclick = (e) => {
    let strong = $api.closest(e.target, 'strong')
    if (strong) {
      openAgreement(strong.dataset.id, strong.dataset.name)
    }
  }

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
    let personRegister = '/crpt-cust/identification/personregister'
    let enterpriseRegister = '/crpt-cust/identification/enterpriseregister'
    let url = type === 'geren' ? personRegister : enterpriseRegister
    if (submitStatus === 'notsubmit') {
      if (type === 'qiye' && !form['name'][1]) {
        return api.toast({ msg: '请输入企业全称', location: 'middle' })
      }
      if (!form['tel'][1]) {
        return api.toast({ msg: '请输入手机号码', location: 'middle' })
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
      if (!$api.byId('checkbox').checked) {
        return api.toast({ msg: '请仔细阅读，并同意协议', location: 'middle' })
      }
      submitStatus = 'submitting'
      let body = {
        phone: form['tel'][1],
        password: Base64.encode(form['pwd'][1]),
        confirmPassword: Base64.encode(form['repwd'][1]),
        verification: form['code'][1]
      }
      if (type === 'qiye') {
        body.name = form['name'][1]
      }
      $api.addCls($api.byId('submit'), 'loading')
      http.post(url, { body }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        api.toast({
          msg: '注册成功',
          location: 'middle',
          global: true
        })
        let body = {
          userType: type === 'geren' ? 1 : 2, // 1个人用户登录，2企业用户登录
          username: form['tel'][1],
          loginType: 1, // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
          // verification: form['code'][1],
          password: form['pwd'][1],
        }
        appLogin(body, function (userinfo) {
          loginSuccessCallback(userinfo)
        })
      }).catch(error => {
        api.toast({
          msg: error.msg || '注册失败',
          location: 'middle'
        })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
      })
    }
  }

}
