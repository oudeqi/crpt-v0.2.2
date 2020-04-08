import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload, openIDcardInfo, openFaceUpload } from '../../webview.js'
import { http } from '../../config.js'

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

  document.querySelector('#start').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!facePic) {
        return api.toast({ msg: '请选择人脸照' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('start'), 'loading')
      http.upload('/crpt-cust/sass/faceauth', {
        files: {
          faceImage: facePic
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('start'), 'loading')
        // openIDcardInfo({
        //   ...ret.data,
        //   front,
        //   back
        // })
      }).catch(error => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('start'), 'loading')
      })
    }
  }

  document.querySelector('#faceupload').onclick = function () {
    openFaceUpload()
  }

}
