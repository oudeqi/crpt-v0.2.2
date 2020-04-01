import '../../app.css'
import './frm.css'

import {
  openReg, openGerenLogin, openQiyeLogin,
  openFindPwd, openSendCode, openTabLayout
} from '../../webview.js'
import { http, openUIInput } from '../../config.js'

apiready = function() {

  let UIInput = api.require('UIInput')
  // 表单数据
  let form = {}

  function renderPwd (inputType) {
    let oldId = form['pwd'] && form['pwd'][0]
    let oldPwd = form['pwd'] && form['pwd'][1]
    // alert(oldId)
    // alert(oldPwd)
    if (oldId) {
      UIInput.close({ id: oldId })
    }
    openUIInput($api.byId('pwd'), form, 'pwd', {
      placeholder: '请输入密码',
      keyboardType: 'done',
      inputType,
      maxStringLength: 16
    }, (id, value) => {
      // alert(id)
      // alert(value)

    })
    if (oldPwd) {
      UIInput.value({ index: oldId, msg: oldPwd })
    }
  }

  renderPwd('password')
  openUIInput($api.byId('tel'), form, 'tel', {
    placeholder: '请输入手机号码',
    keyboardType: 'number',
    maxStringLength: 11
  })

  document.querySelector('#switch').onchange = function () {
    let lockIcon = $api.byId('lockIcon')
    if (this.checked) {
      $api.addCls(lockIcon, 'aui-icon-unlock')
      $api.removeCls(lockIcon, 'aui-icon-lock')
      renderPwd('text')
    } else {
      $api.addCls(lockIcon, 'aui-icon-lock')
      $api.removeCls(lockIcon, 'aui-icon-unlock')
      renderPwd('password')
    }
  }


  document.querySelector('#forget').onclick = function () {
    openFindPwd()
  }
  document.querySelector('#tel_login').onclick = function () {
    openSendCode()
  }
  document.querySelector('#register').onclick = function () {
    openReg()
  }
  document.querySelector('#login').onclick = function () {
    openTabLayout()
  }

}
