import '../../../app.css'
import './win.css'

import { openIDcardUpload } from '../../../webview.js'
import { http } from '../../../config.js'

apiready = function() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  })

  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  document.querySelector('#submit').onclick = function () {
    if (submitStatus === 'notsubmit') {
      let companyName = $api.byId('companyName').value.trim()
      let code = $api.byId('code').value.trim()
      let name = $api.byId('name').value.trim()
      let frID = $api.byId('frID').value.trim()
      if (!companyName) {
        return api.toast({ msg: '请输入企业全称', location: 'middle'  })
      }
      if (!code) {
        return api.toast({ msg: '请输入社会统一信用代码', location: 'middle'  })
      }
      if (!name) {
        return api.toast({ msg: '请输入法定代表人姓名', location: 'middle'  })
      }
      if (!frID) {
        return api.toast({ msg: '请输入法人唯一标识', location: 'middle'  })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('submit'), 'loading')
      http.post('/crpt-cust/saas/company/auth', {
        body: {
          entNameCredit: companyName,  // 企业名称 四川东雄农业科技有限公司
          frName: name, // 法定代表人 万国东
          cid: frID, // 法人唯一标识 51092219690504357X
          regNo: code, // 统一社会信用代码 9151070431459311XW
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        if (ret.data.result === 'YES') {
          openIDcardUpload()
        } else {
          api.toast({ msg: ret.data.info, location: 'middle'  })
        }
      }).catch(error => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        api.toast({ msg: error.msg || '企业四要素认证失败，请确认信息是否正确', location: 'middle' })
      })
    }
  }
}
