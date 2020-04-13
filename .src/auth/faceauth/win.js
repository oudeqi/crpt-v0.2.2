import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill, openAuthResult,
openIDcardUpload, openIDcardInfo, openFaceUpload } from '../../webview.js'
import { http, getPicture, openActionSheet } from '../../config.js'

apiready = function() {

  let pageParam = api.pageParam || {}
  let { userType } = pageParam

  if (userType === '1') { // userType === '1' ? '个人账号' : '企业账号'
    $api.byId('userType').innerHTML = ''
  } else {
    $api.byId('userType').innerHTML = '法定代表人'
  }

  let facePic = ''
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  document.querySelector('#face').onclick = function () {
    let btns = ['相机', '相册']
    let sourceType = ''
    openActionSheet('请选择', btns, function (index) {
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

  document.querySelector('#start').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!facePic) {
        return api.toast({ msg: '请选择人脸照' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('start'), 'loading')
      http.upload('/crpt-cust/saas/faceauth', {
        files: {
          faceImage: facePic
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('start'), 'loading')
        if (ret.data.result === 'YES') {
          openAuthResult('success')
        } else {
          api.toast({ msg: ret.data.info })
        }
      }).catch(error => {
        api.toast({
          msg: error.msg || '网络错误'
        })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('start'), 'loading')
      })
    }
  }

  document.querySelector('#faceupload').onclick = function () {
    openFaceUpload()
  }

}
