import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload, openIDcardInfo } from '../../webview.js'
import { http } from '../../config.js'

apiready = function() {

  let facePic = ''
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  function getPicture (cb) {
    // library         //图片库
    // camera          //相机
    // album           //相册
    api.getPicture({
      sourceType: 'library',
      encodingType: 'png',
      mediaValue: 'pic',
      destinationType: 'file',
      allowEdit: true,
      quality: 100,
      targetWidth: 400,
      targetHeight: 300,
      saveToPhotoAlbum: false
    }, cb)
  }

  document.querySelector('#face').onclick = function () {
    getPicture(function(ret, err) {
      if (ret) {
        $api.dom($api.byId('face'), 'img').src = ret.data;
        facePic = ret.data
      }
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
        // openIDcardInfo({
        //   ...ret.data,
        //   front,
        //   back
        // })
      }).catch(error => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
      })
    }
  }



}
