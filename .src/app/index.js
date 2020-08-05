import {
  openTabLayout,
  // openRegLogin,
  openTodoAuthGeren,
  openTodoAuthQiye,
  // openDanbaoKaitong,
  // openIDcardUpload,
  // openIDcardInfo,
  // openFaceAuth,
} from '../webview.js'
import Utils from '../utils'
import getRealLocation from '../utils/location'
import Router from '../router'
import http from '../http/index.js'
// $api.setStorage()
// $api.getStorage()
// $api.rmStorage()
// $api.clearStorage()

// 保存设备信息
function saveDeviceMes() {
  getRealLocation((params) => {
    console.log(params)
    const sendJson = {
      networkType: api.connectionType, // 网络类型
      deviceType: api.uiMode, // 设备类型
      deviceModel: api.deviceModel, // 设备型号（手机型号）
      deviceUniqueSymbol: api.deviceId, // 设备唯一标识
      longitude: params.longitude, // 经度
      latitude: params.latitude // 纬度
    }
    http.post('/crpt-cust/customer/device/info/save', { body: sendJson }).then(res => {
      // console.log(JSON.stringify(res))
    }).catch(err => {
      console.log(JSON.stringify(err))
    })
  })
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(
  //     function (position) {
  //       const sendJson = {
  //         networkType: api.connectionType, // 网络类型
  //         deviceType: api.uiMode, // 设备类型
  //         deviceModel: api.deviceModel, // 设备型号（手机型号）
  //         deviceUniqueSymbol: api.deviceId, // 设备唯一标识
  //         longitude: position.coords.longitude, // 经度
  //         latitude: position.coords.latitude // 纬度
  //       }
  //       http.post('/crpt-cust/customer/device/info/save', { body: sendJson }).then(res => {
  //         // console.log(JSON.stringify(res))
  //       }).catch(err => {
  //         console.log(JSON.stringify(err))
  //       })
  //     });
  // } else {
  //   alert("不支持定位功能");
  // }
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
    // Router.openPage({ key: 'hxd_u_try_detail'})
    // return
    // Router.openPage({key: 'yjd_account_open', params: {
    //   pageParam: {
    //     productId: '1'
    //   }
    // }})
    // return
    // let url = 'https://opentest.hopebank.com:42220/opcf-yfk/#/mobileUniversal/phoneconfirm/open?appID=FLEXB3b12c980d56f4ec9ab81e24a0c668bb1&unicodeKey=opf-aos%3AopenAcct%3A487769829156272516'
    // let productId = '1282497823763111937'
    // Router.openPage({key: 'yjd_face_auth', params: {pageParam: { url, productId }}})
    // openFaceAuth()
    // return
    // saveDeviceMes()
    // Router.openPage({
    //   key: 'face'
    // })
    const userinfo = $api.getStorage('userinfo')
    if (userinfo) {
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
      // openRegLogin()
      Router.openPage({
        key: 'login_index'
      })
    }
  }
  bindEvent() {
    // 云修复完成
    api.addEventListener({
      name: 'smartupdatefinish'
    }, (ret, err) => {
      api.confirm({
        title: '提示',
        msg: 'App更新完成，是否需要重启应用？',
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
