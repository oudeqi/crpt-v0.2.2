import '../../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill, openAuthResult,
openIDcardUpload, openIDcardInfo, openFaceUpload } from '../../../webview.js'
import { http, getPicture, ActionSheet } from '../../../config.js'

apiready = function() {
  
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  let pageParam = api.pageParam || {}
  let { userType } = pageParam

  if (userType === '1') { // userType === '1' ? '个人账号' : '企业账号'
    $api.byId('userType').innerHTML = ''
  } else {
    $api.byId('userType').innerHTML = '法定代表人'
  }

  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  function pickPic (fn) {
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
          fn(ret.data)
        }
      })
    })
  }

  async function submit (path) {
    return http.upload('/crpt-cust/saas/faceauth', {
      files: {
        faceImage: path
      }
    })
  }

  document.querySelector('#start').onclick = function () {
    if (submitStatus === 'notsubmit') {
      pickPic(async function (path) {
        submitStatus = 'submitting'
        $api.addCls($api.byId('start'), 'loading')
        api.showProgress({ title: '加载中...', text: '', modal: false })
        try {
          const ret = await submit()
        } catch (error) {
          api.toast({
            msg: error.msg || '网络错误'
          })
        }
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('start'), 'loading')
        api.hideProgress()
        if (ret.data.result === 'YES') {
          openAuthResult({status: 'success'})
        } else {
          api.toast({ msg: ret.data.info })
        }
      })
    }
  }

  document.querySelector('#faceupload').onclick = function () {
    openFaceUpload()
  }

}
