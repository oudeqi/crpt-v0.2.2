import {
  openAgreement,
  openSendAddress,
  openDanbaoKaitong,
  openDanbaoRenList,
  openDanbaoRenForm,
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
  openContactUs,
  openProductDetails,
  openProductRecommend
} from '../webview.js'
import Utils from '../utils'
import Router from '../router'
import http from '../http/index.js'
// $api.setStorage()
// $api.getStorage()
// $api.rmStorage()
// $api.clearStorage()

// 保存设备信息
function saveDeviceMes() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const sendJson = {
          networkType: api.connectionType, // 网络类型
          deviceType: api.uiMode, // 设备类型
          deviceModel: api.deviceModel, // 设备型号（手机型号）
          deviceUniqueSymbol: api.deviceId, // 设备唯一标识
          longitude: position.coords.longitude, // 经度
          latitude: position.coords.latitude // 纬度
        }
        http.post('/crpt-cust/customer/device/info/save', {body: sendJson}).then(res => {
          // console.log(JSON.stringify(res))
        }).catch (err => {
          console.log(JSON.stringify(err))
        })
      });
  } else {
    alert("不支持定位功能");
  }
}

class App {

  init() {
    // 认证状态 int
    // 1：正常
    // 2：待实名认证
    // 3：待人脸审核
    // 4：人脸认证失败，待人工审核
    // 5：待补充基本信息
    // 6：人工审核不通过
    // $api.clearStorage()
    // Utils.Router.openPageCreditInformation()

    // openTodoAuthQiye({status: 'error', tips: 'message'})
    // return
    // Router.openPage({ key: 'loan_details' })
    // return
    const userinfo = $api.getStorage('userinfo')
    if (userinfo) {
      // openIDcardUpload()
      // openSendAddress({
      //   gtCreditId: '1258945510237147136',
      //   gtId: '1263411018323742721'
      // })
      // openDanbaoRenList({
      //   gtCreditId: '1268076050915659776',
      //   productId: '4',
      //   demandMoney: '50',
      //   gtId: '1268076050995986433'
      // })
      // return
      // openSendCode({ tel: '18989193377', userType: 1 })
      // return
      // openDanbaoKaitong({step: 0, creditStatus: 2})
      // return
      // Router.openPage({ key: 'wallet' })

      // return
      const authStatus = $api.getStorage('authStatus') || {}
      if (authStatus.status === 1) {
        openTabLayout()
        saveDeviceMes()
      } else {
        const userType = userinfo.userType
        if (userType === '1') {
          openTodoAuthGeren()
        } else {
          openTodoAuthQiye()
        }
      }
    } else {
      openRegLogin()
    }
  }
  bindEvent() {
    // 云修复完成
    api.addEventListener({
      name: 'smartupdatefinish'
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
      name: 'launchviewclicked'
    }, (ret, err) => {
      api.alert({
        msg: ret.value
      })
    })
  }

}


apiready = function () {

  const ctrl = new App()
  ctrl.init()
  ctrl.bindEvent()
}
