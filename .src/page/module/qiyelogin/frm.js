import '../../../app.css'
import './frm.css'

import {
  openReg, openGerenLogin, openQiyeLogin,
  openFindPwd, openSendCode
} from '../../../webview.js'
import { http, openUIInput } from '../../../config.js'
import trim from 'lodash/trim'

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
  document.querySelector('#pwd_login').onclick = function () {
    openGerenLogin({userType: 2})
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
    $api.addCls($api.byId('tel_login'), 'loading')
    http.post('/crpt-cust/identification/gainenterprisephone', {
      body: {
        account: trim(companyName)
      }
    }).then(res => {
      submitStatus = 'notsubmit'
      $api.removeCls($api.byId('tel_login'), 'loading')
      if (res.data) {
        openSendCode({ tel: res.data, userType: 2 })
      } else {
        api.toast({
          msg: '获取企业法人手机号失败',
          location: 'middle'
        })
      }
    }).catch(error => {
      api.toast({
        msg: error.msg || '获取企业法人手机号失败',
        location: 'middle'
      })
      submitStatus = 'notsubmit'
      $api.removeCls($api.byId('tel_login'), 'loading')
    })
  }


}
