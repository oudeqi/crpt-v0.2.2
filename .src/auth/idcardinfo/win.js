import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload, openIDcardInfo } from '../../webview.js'
import { http } from '../../config.js'

apiready = function() {


  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  // let idcard = {
  //   "code":200,
  //   "msg":"",
  //   "data":{
  //     "name":"周永刚",
  //     "gender":"男",
  //     "number":"622424199409270411",
  //     "birthday":"1994-09-27",
  //     "address":"甘肃省通渭县平襄镇瓦石村高家庄社45号",
  //     "nation":"汉",
  //     "authority":"通渭县公安局",
  //     "timelimit":"20110125-20210125"
  //   }
  // }

  let pageParam = api.pageParam || {}
  let { name, gender, number, birthday, address,
    nation, authority, timelimit, front, back } = pageParam

  $api.byId('name').innerHTML = name
  $api.byId('number').innerHTML = number
  $api.byId('authority').innerHTML = authority
  $api.byId('timelimit').innerHTML = timelimit
  $api.byId('nation').innerHTML = nation
  $api.byId('address').innerHTML = address

  document.querySelector('#retry').onclick = function () {
    api.closeWin()
  }

  document.querySelector('#next').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!name || !gender || !number || !birthday || !address || !nation || !authority || !timelimit) {
        return api.toast({ msg: '未完全识别，请重新上传' })
      }
      if (!$api.byId('checkbox').checked) {
        return api.toast({ msg: '请仔细阅读，并同意协议' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('next'), 'loading')
      http.upload('/crpt-cust/saas/realnameauth', {
        values: pageParam,
        files: {
          certImageFront: front,
          certImageBack: back
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
        // openIDcardInfo(ret.data)
      }).catch(error => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
      })
    }


  }

}
