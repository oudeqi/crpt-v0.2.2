import {
  // openDrawerLayout,
  openMsgCenter,
  openTabLayout,
  openRegLogin,
  openReg,
  openGerenLogin,
  openQiyeLogin,
  openSendCode,
  openFindPwd,
  openBaseinfoFill,
  openTodoAuthGeren,
  openTodoAuthQiye,
  openCompanyInfo,
  openIDcardUpload,
  openIDcardInfo,
  openFaceAuth,
  openFaceUpload,
  openYuguEdu,
  openAuthResult,
  openBillList,
  openBillDetails,
  openOrderList,
  openMyProduct,
  openSettings,
  openContactUs
} from '../webview.js'

// $api.setStorage()
// $api.getStorage()
// $api.rmStorage()
// $api.clearStorage()

apiready = function () {
  // $api.clearStorage()
  if ($api.getStorage('userinfo')) {
    openRegLogin()
    // openTabLayout()
    // openBillDetails()
    // openTodoAuthGeren()
    // openTodoAuthQiye()
  } else {
    openRegLogin()
  }

  // 云修复完成
  api.addEventListener({
    name:'smartupdatefinish'
  }, (ret, err) => {
    api.confirm({
      title: '提示',
      msg: '云修复完成，是否需要重启应用？',
      buttons: ['确定', '取消']
    }, (ret, err) => {
      var index = ret.buttonIndex
      if (index === 1) {
        api.rebootApp()
      }
    })
  })

  // 点击启动页面
  api.addEventListener({
    name:'launchviewclicked'
  }, (ret,err) => {
    api.alert({
      msg:ret.value
    })
  })

  api.addEventListener({
    name: 'keyback'
  }, function(ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })

}
