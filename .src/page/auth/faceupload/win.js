import '../../../app.css'
import './win.css'

import { openAuthResult } from '../../../webview.js'
import { http, getPicture, ActionSheet } from '../../../config.js'

apiready = function() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let facePic = ''
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  document.querySelector('#face').onclick = function () {
    let btns = ['相机', '相册']
    let sourceType = ''
    ActionSheet('请选择', btns, function (index) {
      if (index === 0) {
        sourceType = 'camera'
      } else {
        sourceType = 'library'
      }
      getPicture(sourceType, function(ret, err) {
        if (ret) {
          $api.byId('pic').innerHTML = `<img src="${ret.data}" alt="">`
          facePic = ret.data
        }
      })
    })
  }

  document.querySelector('#submit').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!facePic) {
        return api.toast({ msg: '请选择手持身份证照片', location: 'middle' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('submit'), 'loading')
      api.showProgress({ title: '加载中...', text: '', modal: false })
      http.upload('/crpt-cust/saas/bodyverify/submission', {
        files: {
          faceImage: facePic
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        api.hideProgress()
        openAuthResult({status: 'during'})
      }).catch(error => {
        submitStatus = 'notsubmit'
        api.hideProgress()
        api.toast({ msg: error.msg || '网络错误', location: 'middle' })
        $api.removeCls($api.byId('submit'), 'loading')
      })
    }
  }



}
