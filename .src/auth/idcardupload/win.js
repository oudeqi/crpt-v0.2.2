import '../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload, openIDcardInfo } from '../../webview.js'
import { http } from '../../config.js'

apiready = function() {

  let userinfo = $api.getStorage('userinfo')
  let { name, userType } = userinfo

  if (userType === '1') { // userType === '1' ? '个人账号' : '企业账号'
    $api.byId('userType').innerHTML = ''
  } else {
    $api.byId('userType').innerHTML = '法定代表人'
  }

  let front = ''
  let back = ''
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

  document.querySelector('#front').onclick = function () {
    getPicture(function(ret, err) {
      if (ret) {
        $api.dom($api.byId('front'), 'img').src = ret.data;
        front = ret.data
        // api.alert({ msg: front })
      }
    })
  }

  document.querySelector('#back').onclick = function () {
    getPicture(function(ret, err) {
      if (ret) {
        $api.dom($api.byId('back'), 'img').src = ret.data;
        back = ret.data
      }
    });
  }

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

  document.querySelector('#next').onclick = function () {
    // openIDcardInfo()
    if (submitStatus === 'notsubmit') {
      if (!front) {
        return api.toast({ msg: '请选择身份证正面' })
      }
      if (!back) {
        return api.toast({ msg: '请选择身份证反面' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('next'), 'loading')
      http.upload('/crpt-cust/saas/ocr', {
        files: {
          certImageFront: front,
          certImageBack: back
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
        openIDcardInfo({
          ...ret.data,
          front,
          back
        })
      }).catch(error => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
      })
    }
  }

}
