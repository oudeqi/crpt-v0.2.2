import '../../app.css'
import './win.css'

import { openTabLayout } from '../../webview.js'

function openUIInput (dom, options = {}, cb) {
  let UIInput = api.require('UIInput')
  let rect = $api.offset(dom)
  let {
    maxRows,
    maxStringLength,
    inputType,
    placeholder,
    keyboardType,
    alignment,
    isCenterVertical
  } = options
  UIInput.open({
    rect: {
      x: rect.l,
      y: rect.t,
      w: rect.w,
      h: rect.h
    },
    fixed: false,
    autoFocus: false,
    maxRows: maxRows || 1,
    maxStringLength,
    inputType,
    placeholder,
    keyboardType,
    alignment,
    isCenterVertical,
    fixedOn: api.frameName,
    styles: {
      bgColor: 'rgba(0,0,0,0)',
      size: 16,
      color: '#333',
      placeholder: {
        color: '#aaa'
      }
    },
  }, function (ret) {
    UIInput.value({ id: ret.id }, function(value) {
      if (value) {
        cb && cb(value.msg)
      }
    })
  })
}

apiready = function() {

  document.querySelector('#xxx').onclick = function () {
    openTabLayout()
  }

  const postData = {
    pwd: '',
    repwd: '',
    code: ''
  }

  openUIInput($api.byId('pwd'), {
    placeholder: '设置登录密码',
    keyboardType: 'next',
    inputType: 'password',
    maxStringLength: 10
  }, function (value) {
    postData.pwd = value
  })

  openUIInput($api.byId('repwd'), {
    placeholder: '确认登录密码',
    keyboardType: 'next',
    inputType: 'password',
    maxStringLength: 10
  }, function (value) {
    postData.repwd = value
  })

  openUIInput($api.byId('code'), {
    placeholder: '短信验证码',
    keyboardType: 'number',
    maxStringLength: 6
  }, function (value) {
    postData.code = value
  })
}
