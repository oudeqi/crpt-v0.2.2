import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload } from '../../webview.js'
import { http, initUIInput } from '../../config.js'

apiready = function() {

  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交
  let postData = {
    companyName: '',
    code: '',
    name: '',
    frID: ''
  }

  initUIInput($api.byId('companyName'), {
    placeholder: '请输入...',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.companyName = value
  })

  initUIInput($api.byId('code'), {
    placeholder: '请输入...',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.code = value
  })

  initUIInput($api.byId('name'), {
    placeholder: '请输入...',
    keyboardType: 'next',
    maxStringLength: 10
  }, function (value) {
    postData.name = value
  })

  initUIInput($api.byId('frID'), {
    placeholder: '请输入...',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.frID = value
  })

  document.querySelector('#submit').onclick = function () {
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
          entNameCredit: postData.companyName,  // 企业名称 四川东雄农业科技有限公司
          frName: postData.name, // 法定代表人 万国东
          cid: postData.frID, // 法人唯一标识 51092219690504357X
          regNo: postData.code, // 统一社会信用代码 9151070431459311XW
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        if (ret.data.result === 'YES') {
          openIDcardUpload()
        } else {
          api.toast({ msg: ret.data.info })
        }
      }).catch(error => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        api.toast({ msg: error.msg || '企业四要素认证失败，请确认信息是否正确' })
      })
    }
  }
}
