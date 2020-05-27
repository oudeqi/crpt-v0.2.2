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
  openOrderTodo,
  openMyProduct,
  openMyQuota,
  openSettings,
  openContactUs,
  openProductDetails,
  openProductRecommend
} from '../webview.js'
import Utils from '../utils'
// $api.setStorage()
// $api.getStorage()
// $api.rmStorage()
// $api.clearStorage()
apiready = function () {
  // openBaseinfoFill()
  // openCompanyInfo()
  // $api.clearStorage()
  const userinfo = $api.getStorage('userinfo')

  Utils.Router.openPageCreditInformation()

  // if (userinfo) {
  //   openBaseinfoFill()
  // } else {
  //   alert('meiyou denglu')
  // }
  // 认证状态 int
  // 1：正常
  // 2：待实名认证
  // 3：待人脸审核
  // 4：人脸认证失败，待人工审核
  // 5：待补充基本信息
  // 6：人工审核不通过
  // Utils.Router.openPageCreditInformation()

  // if (userinfo) {
  //   const authStatus = $api.getStorage('authStatus') || {}
  //   if (authStatus.status === 1) {
  //     openTabLayout()
  //   } else {
  //     const userType = userinfo.userType
  //     if (userType === '1') {
  //       openTodoAuthGeren()
  //     } else {
  //       openTodoAuthQiye()
  //     }
  //   }
  // } else {
  //   openRegLogin()
  // }

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

}
