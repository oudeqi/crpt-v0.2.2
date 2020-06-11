import '../../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill, openAuthResult,
openIDcardUpload, openIDcardInfo } from '../../../webview.js'
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
        sourceType = 'album'
      }
      getPicture(sourceType, function(ret, err) {
        if (ret) {
          $api.dom($api.byId('face'), 'img').src = ret.data;
          facePic = ret.data
        }
      })
    })
  }

  document.querySelector('#submit').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!facePic) {
        return api.toast({ msg: '请选择手持身份证照片' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('submit'), 'loading')
      http.upload('/crpt-cust/saas/bodyverify/submission', {
        files: {
          faceImage: facePic
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        openAuthResult('during')
      }).catch(error => {
        submitStatus = 'notsubmit'
        api.toast({
          msg: error.msg || '网络错误'
        })
        $api.removeCls($api.byId('submit'), 'loading')
      })
    }
  }



}
