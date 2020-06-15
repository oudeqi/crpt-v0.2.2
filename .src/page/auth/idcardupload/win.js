import '../../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill,
openIDcardUpload, openIDcardInfo } from '../../../webview.js'
import { http, ActionSheet, getPicture } from '../../../config.js'

apiready = function() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let userinfo = $api.getStorage('userinfo')
  let { name, userType } = userinfo
  $api.byId('name').innerHTML = name
  if (userType === '1') { // userType === '1' ? '个人账号' : '企业账号'
    $api.byId('userType').innerHTML = ''
  } else {
    $api.byId('userType').innerHTML = '法定代表人'
  }

  let front = ''
  let back = ''
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  document.querySelector('#front').onclick = function () {
    let btns = ['相机', '相册']
    let sourceType = ''
    if(api.systemType === 'ios') {
      ActionSheet('请选择', btns, function (index) {
        if (index === 0) {
          sourceType = 'camera'
        } else {
          sourceType = 'album'
        }
        getPicture(sourceType, function(ret, err) {
          if (ret) {
            $api.dom($api.byId('front'), 'img').src = ret.data
            front = ret.data
          }
        })
      })
    }else {
      const cardcamera = api.require('cardcamera');
      cardcamera.frontIdCard({}, function(ret, err) {
        if (ret.status) {
          $api.dom($api.byId('front'), 'img').src = ret.data
          front = ret.data
        }
      });
    }
  }

  document.querySelector('#back').onclick = function () {
    let btns = ['相机', '相册']
    let sourceType = ''
    if(api.systemType === 'ios') {
      ActionSheet('请选择', btns, function (index) {
        if (index === 0) {
          sourceType = 'camera'
        } else {
          sourceType = 'album'
        }
        getPicture(sourceType, function(ret, err) {
          if (ret) {
            $api.dom($api.byId('back'), 'img').src = ret.data
            back = ret.data
          }
        })
      })
    }else {
      const cardcamera = api.require('cardcamera');
      cardcamera.backIdCard({}, function(ret, err) {
        if (ret.status) {
          $api.dom($api.byId('back'), 'img').src = ret.data
          back = ret.data
        }
      });
    }
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
      api.showProgress({
        title: '加载中...',
        text: '',
        modal: false
      })
      http.upload('/crpt-cust/saas/ocr', {
        files: {
          certImageFront: front,
          certImageBack: back
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
        api.hideProgress()
        openIDcardInfo({
          ...ret.data,
          front,
          back
        })
      }).catch(error => {
        api.toast({
          msg: error.msg || '网络错误'
        })
        api.hideProgress()
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
      })
    }
  }

}
