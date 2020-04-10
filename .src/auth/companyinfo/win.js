import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload } from '../../webview.js'
import { http } from '../../config.js'

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

  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交
  let postData = {
    companyName: '',
    code: '',
    name: '',
    frID: ''
  }

  openUIInput($api.byId('companyName'), {
    placeholder: '请输入...',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.companyName = value
  })

  openUIInput($api.byId('code'), {
    placeholder: '请输入...',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.code = value
  })

  openUIInput($api.byId('name'), {
    placeholder: '请输入...',
    keyboardType: 'next',
    maxStringLength: 10
  }, function (value) {
    postData.name = value
  })

  openUIInput($api.byId('frID'), {
    placeholder: '请输入...',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.frID = value
  })

  document.querySelector('#submit').onclick = function () {
    // openIDcardUpload()
    console.log(JSON.stringify(postData))
    if (submitStatus === 'notsubmit') {
      if (!postData.companyName) {
        return api.toast({ msg: '请输入企业全称' })
      }
      if (!postData.code) {
        return api.toast({ msg: '请输入社会统一信用代码' })
      }
      if (!postData.name) {
        return api.toast({ msg: '请输入法定代表人姓名' })
      }
      if (!postData.frID) {
        return api.toast({ msg: '请输入法人唯一标识' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('submit'), 'loading')
      http.post('/crpt-cust/saas/company/auth', {
        body: {
          entNameCredit: postData.companyName,  // 企业名称 上海风报信息科技有限公司
          frName: postData.name, // 法定代表人 胡喜
          cid: postData.frID, // 法人唯一标识 p_64d9c37db2e64d5201a90b4cc37d238e
          regNo: postData.code, // 统一社会信用代码 91310115MA1K41TJ1J
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        if (ret.data.result === 'NO') {
          openIDcardUpload()
        } else {
          api.toast({ msg: ret.data.info })
        }
      }).catch(error => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        api.toast({ msg: '企业四要素认证失败，请确认信息是否正确' })
      })
    }
  }
}
