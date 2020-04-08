import '../../app.css'
import './frm.css'

import {
  openReg, openGerenLogin, openQiyeLogin,
  openFindPwd, openSendCode
} from '../../webview.js'
import { http, openUIInput } from '../../config.js'

apiready = function() {

  // 表单数据
  let form = {}
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  openUIInput($api.byId('name'), form, 'name', {
    placeholder: '请输入...',
    isCenterVertical: false,
    maxRows: 2,
    keyboardType: 'done',
    maxStringLength: 40
  })

  document.querySelector('#register').onclick = function () {
    openReg()
  }

  document.querySelector('#tel_login').onclick = function () {
    if (submitStatus === 'notsubmit') {
      let companyName = form['name'][1]
      if (companyName) {
        qiyeSendCode(companyName)
      } else {
        api.toast({ msg: '请输入公司全称' })
      }
    }
  }

  function qiyeSendCode (companyName) {
    submitStatus = 'submitting'
    http.post('/crpt-cust/identification/gainenterprisephone', {
      body: {
        account: companyName
      }
    }).then(res => {
      if (res.phone) {
        openSendCode({ tel, loginType: 'qiye' })
      } else {
        api.toast({ msg: '获取企业法人手机号失败' })
      }
      submitStatus = 'notsubmit'
      $api.removeCls($api.byId('submit'), 'loading')
    }).catch(error => {
      api.toast({ msg: '获取企业法人手机号失败' })
      submitStatus = 'notsubmit'
      $api.removeCls($api.byId('submit'), 'loading')
    })
  }


}
