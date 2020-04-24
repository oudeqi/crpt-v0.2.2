import {
  openRegLogin,
  openTabLayout,
  openTodoAuthGeren,
  openTodoAuthQiye
} from './webview.js'
import { Base64 } from 'js-base64'

const dev = 'http://crptdev.liuheco.com'
const uat = 'http://crptuat.liuheco.com'
const prod = 'http://crptuat.liuheco.com'
const baseUrl = __buildEnv__ === 'development' ? dev : __buildEnv__ === 'testing' ? uat : prod
const whiteList = [ // 白名单里不带token，否则后端会报错
  '/sms/smsverificationcode',
  '/identification/gainenterprisephone',
  '/identification/personregister',
  '/identification/enterpriseregister',
  '/identification/enterpriseregister',
  '/identification/getbackpassword',
  '/auth/oauth/token',
  '/auth/token/' // 退出登录
]

let hasAlert = false

function ajax (method, url, data = {}, { headers = {}, tag = null, timeout = 30} = {}) {
  return new Promise((resolve, reject) => {
    let token = ''
    if (headers.token) {
      token = headers.token
    } else {
      const userinfo = $api.getStorage('userinfo')
      token = userinfo ? (userinfo.token_type + ' ' + userinfo.access_token) : ''
    }
    let contentType = {
      'Content-Type': 'application/json;charset=utf-8'
    }
    let Authorization = {
      Authorization: token
    }
    method === 'upload' ? contentType = {} : null
    const include = whiteList.find(value => url.includes(value))
    include ? Authorization = {} : null
    api.ajax({
      url: baseUrl + url,
      method: method === 'upload' ? 'post' : method,
      data,
      tag,
      timeout,
      headers: {
        ...Authorization,
        ...contentType,
        ...headers
      } 
    }, (ret, error) => {
      if (ret) {
        if (ret.code === 200) {
          resolve(ret)
        } else {
          reject(ret)
        }
      } else {
        if (error.statusCode === 500 && error.body.code === 216) {
          if (!hasAlert) {
            hasAlert = true
            api.alert({
              title: '提示',
              msg: '登录状态已经过期，请重新登录！',
            }, function(ret, err){
              hasAlert = false
              api.closeWin({ name: 'html/register/win' })
              api.closeWin({ name: 'html/gerenlogin/win' })
              api.closeWin({ name: 'html/qiyelogin/win' })
              setTimeout(() => {
                $api.clearStorage()
                openRegLogin()
              }, 150)
            })
          }
        }
        reject(error)
      }
      if (__buildEnv__ !== 'production') {
        if (ret) {
          console.log('/************* SUCCESS. **********/')
        } else {
          console.log('/************* ERROR. ************/')
        }
        console.log('__URL ==> ' + baseUrl + url)
        console.log('__TOKEN ==> ' + token)
        console.log('__BODY ==> ' + JSON.stringify(data))
        console.log('__DATA ==> ' + JSON.stringify(ret || error))
      }
    })
  })
}

const http = {
  cancel: tag => api.cancelAjax({ tag }),
  get: (url, data, { headers, tag, timeout } = {}) => ajax('get', url, data, {headers, tag, timeout}),
  post: (url, data, { headers, tag, timeout } = {}) => ajax('post', url, data, {headers, tag, timeout}),
  put: (url, data, { headers, tag, timeout } = {}) => ajax('put', url, data, {headers, tag, timeout}),
  delete: (url, data, { headers, tag, timeout } = {}) => ajax('delete', url, data, {headers, tag, timeout}),
  upload: (url, data, { headers, tag, timeout } = {}) => ajax('upload', url, data, {headers, tag, timeout})
}

// 统一ios和android的输入框，下标都从0开始
// const getUIInputIndex = i => api.systemType === 'ios' ? i - 1 : i

const resetUIInputPosi = (dom, id) => {
  let UIInput = api.require('UIInput')
  let rect = $api.offset(dom)
  UIInput.resetPosition({
    id,
    position: {
      x: rect.l,
      y: rect.t,
    }
  })
}

const openUIInput = (dom, form, key, options = {}, cb) => {
  let UIInput = api.require('UIInput')
  let rect = $api.offset(dom)
  let {
    maxRows,
    maxStringLength,
    inputType,
    placeholder,
    keyboardType,
    alignment,
    isCenterVertical
  } = options
  UIInput.open({
    rect: {
      x: rect.l,
      y: rect.t,
      w: rect.w,
      h: rect.h
    },
    fixed: false,
    autoFocus: false,
    maxRows: maxRows || 1,
    maxStringLength,
    inputType,
    placeholder,
    keyboardType,
    alignment,
    isCenterVertical,
    fixedOn: api.frameName,
    styles: {
      bgColor: 'rgba(0,0,0,0)',
      size: 16,
      color: '#333',
      placeholder: {
        color: '#aaa'
      }
    },
  }, function (ret) {
    cb && cb(ret.id)
    UIInput.value({ id: ret.id }, function(value) {
      form[key] = [ ret.id, value && value.msg ? value.msg : '' ]
    })
  })
}

const isPhoneNo = phone => (/^1[3456789]\d{9}$/.test(phone))
const phoneNoFormat = (tel, tag = '****') => {
  let a = String(tel).substring(0, 3)
  let b = String(tel).substr(3, 4)
  let c = String(tel).substr(7, 4)
  if (tag === '****') {
    return a + tag + c
  } else {
    return a + tag + b + tag + c
  }
}

function ActionSheet (title, buttons, cb) {
  api.actionSheet({
    title,
    cancelTitle: '取消',
    buttons
  }, function(ret, err) {
    let index = ret.buttonIndex // index 从1开始
    if (index !== buttons.length + 1) {
      cb(index - 1)
    }
  })
}

function CityList(pos = {}, cb) {
  let UICityList = api.require('UICityList')
  UICityList.open({
    rect: {
      x: pos.x || 0,
      y: pos.y || 0,
      w: pos.w || api.frameWidth,
      h: pos.h || api.frameHeight
    },
    resource: 'widget://res/UICityList.json',
    topCitys: [{
      'city': '北京', //字符串类型；城市
      'id': 110001, //字符串类型；城市编号
      'pinyin': 'beijing' //（可选项）字符串类型；本字段可不传，若不传模块内会生成该城市名的pinyin，以防止城市名中的多音字乱序问题
    }],
    styles: {
      searchBar: {
        bgColor: '#696969',
        cancelColor: '#E3E3E3'
      },
      location: {
        color: '#696969',
        size: 12
      },
      sectionTitle: {
        bgColor: '#eee',
        color: '#000',
        size: 12
      },
      item: {
        bgColor: '#fff',
        activeBgColor: '#696969',
        color: '#000',
        size: 14,
        height: 40
      },
      indicator: {
        bgColor: '#fff',
        color: '#696969'
      }
    },
    searchType: 'fuzzy',
    currentCity: '北京',
    locationWay: 'GPS',
    hotTitle: '热门城市',
    fixedOn: api.frameName,
    placeholder: '输入城市名或首字母查询',
    // backBtn: {
    //   rect: {
    //     x: 0,      //（可选项）数字类型；按钮左上角的 x 坐标（相对于模块）；默认：2
    //     y: 0,      //（可选项）数字类型；按钮左上角的 y 坐标（相对于模块）；默认：2
    //     w: 36,    //（可选项）数字类型；按钮的宽度；默认：36
    //     h: 36     //（可选项）数字类型；按钮的高度；默认：36
    //   },
    //   title: '关闭',    //（可选项）字符串类型；按钮标题；默认：不显示
    //   titleColor: '#000000',//（可选项）字符串类型；按钮标题颜色；默认：#ff0000
    //   bgColor: '',   //（可选项）字符串类型；按钮背景颜色；默认：透明
    //   // image:''      //（可选项）字符串类型；按钮背景图片；默认：不显示
    // }
  }, function(ret, err) {
    if (ret.eventType === 'back') {
      // UICityList.close()
    } else if (ret.eventType === 'selected') {
      cb(ret.cityInfo)
      // UICityList.close()
    }
  })
}

function CitySelector (cb) {
  let UIActionSelector = api.require('UIActionSelector')
  UIActionSelector.open({
    datas: 'widget://res/city.json',
    layout: {
      row: 5,
      col: 3,
      height: 30,
      size: 12,
      sizeActive: 14,
      rowSpacing: 5,
      colSpacing: 10,
      maskBg: 'rgba(0,0,0,0.2)',
      bg: '#fff',
      color: '#333',
      colorActive: '#f00',
      colorSelected: '#000'
    },
    animation: true,
    cancel: {
      text: '取消',
      size: 12,
      w: 90,
      h: 35,
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    ok: {
      text: '确定',
      size: 12,
      w: 90,
      h: 35,
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    title: {
      text: '请选择',
      size: 12,
      h: 44,
      bg: '#eee',
      color: '#888'
    },
    fixedOn: api.frameName
  }, function(ret, err) {
    if (ret.eventType === 'ok') {
      cb(ret.selectedInfo)
    }
  })
}

function getPicture (sourceType, cb) {
  // library         //图片库
  // camera          //相机
  // album           //相册
  api.getPicture({
    sourceType,
    encodingType: 'png',
    mediaValue: 'pic',
    destinationType: 'file',
    allowEdit: false,
    quality: 100,
    targetWidth: 1000,
    // targetHeight: 300,
    saveToPhotoAlbum: false
  }, cb)
}

function initUIInput (dom, options = {}, cb) {
  let UIInput = api.require('UIInput')
  let rect = $api.offset(dom)
  let {
    maxRows,
    maxStringLength,
    inputType,
    placeholder,
    keyboardType,
    alignment,
    isCenterVertical
  } = options
  UIInput.open({
    rect: {
      x: rect.l,
      y: rect.t,
      w: rect.w,
      h: rect.h
    },
    fixed: false,
    autoFocus: false,
    maxRows: maxRows || 1,
    maxStringLength,
    inputType,
    placeholder,
    keyboardType,
    alignment,
    isCenterVertical,
    fixedOn: api.frameName,
    styles: {
      bgColor: 'rgba(0,0,0,0)',
      size: 16,
      color: '#333',
      placeholder: {
        color: '#aaa'
      }
    },
  }, function (ret) {
    UIInput.value({ id: ret.id }, function(value) {
      if (value) {
        cb && cb(value.msg)
      }
    })
  })
}

// let userinfo = {
//   "access_token": "6ca22146-008e-4c12-9772-8d72229b731b",
//   "token_type":"bearer",
//   "refresh_token":"6509c5e3-b3d5-4725-9f1b-89b5f548d444",
//   "expires_in":599757,
//   "scope":"app",
//   "msg":"6ca22146-008e-4c12-9772-8d72229b731b",
//   "code":200,
//   "data":"6ca22146-008e-4c12-9772-8d72229b731b",
//   "name":"欧威",
//   "userType":"1",
//   "makeBy":"nh-cloud",
//   "userId":"20"
// }
function loginSuccessCallback (userinfo) {
  $api.setStorage('userinfo', userinfo) // 用户信息
  getAndStorageAuthStatus(function (status) {
    // 认证状态 int
    // 1：正常
    // 2：待实名认证
    // 3：待人脸审核
    // 4：人脸认证失败，待人工审核
    // 5：待补充基本信息
    // 6：人工审核不通过
    if (status === 1) {
      openTabLayout()
    } else {
      const { userType } = userinfo || {}
      if (userType === '1') { // 1个人用户登录 2企业用户登录
        openTodoAuthGeren()
      } else if (userType === '2') {
        openTodoAuthQiye()
      }
    }
  })
}

function getAndStorageAuthStatus (successCallback, errorCallback) {
  // 认证状态 int
  // 1：正常
  // 2：待实名认证
  // 3：待人脸审核
  // 4：人脸认证失败，待人工审核
  // 5：待补充基本信息
  // 6：人工审核不通过
  http.get(`/crpt-cust/customer/query/authstatus`).then(res => {
    try {
      $api.setStorage('authStatus', { status: res.data })
      successCallback && successCallback(res.data)
    } catch (e) {
      console.log(JSON.stringify(e))
    } finally {

    }
  }).catch(error => {
    api.toast({
      msg: error.msg || '获取认证状态失败'
    })
    errorCallback && errorCallback(error)
  })
}


function setRefreshHeaderInfo (successCallback, errorCallback, options = {}) {
  api.setRefreshHeaderInfo({
    // loadingImg: 'widget://image/refresh.png',
    bgColor: 'rgba(0,0,0,0)',
    textColor: '#bfbfbf',
    textDown: '下拉刷新',
    textUp: '松开刷新',
    textLoading: '加载中...',
    showTime: false,
    ...options
  }, function (ret, error) {
    if (error) {
      errorCallback(error)
    } else {
      successCallback(ret)
    }
  })
}

function appLogin (options, successCallback, errorCallback) {
  let pwd = ''
  if (options.verification) { // 在验证码登录的时候，密码必须设置为手机号码
    pwd = options.username
  } else {
    pwd = Base64.encode(options.password || '')
  }
  http.post('/auth/oauth/token', {
    values: {
      loginDevice: api.deviceId, // 客户手机设备号(android-imei,IOS-??)
      ipAddress: '',
      latitude: '',
      longitude: '',
      terminal_version: api.systemVersion, // 系统终端版本
      location: '', // 最近登录地点
      grant_type: 'password', // 固定传password
      scope: 'app', // 固定传app
      client_id: 'client', // client
      client_secret: 'secret', // 固定传secret
      // userType: params.userType || 1, // 1个人用户登录，2企业用户登录
      // username: form['tel'][1],
      // loginType: 1, // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
      // verification: form['code'][1], // 验证码
      // password: form['pwd'][1] // 在验证码登录的时候，密码必须设置为手机号码
      ...options,
      password: pwd,
    }
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    } 
  }).then(function (userinfo) {
    api.toast({
      msg: '登录成功',
      location: 'middle',
      global: true
    })
    successCallback && successCallback(userinfo)
  }).catch(function (error) {
    api.toast({
      msg: error.msg || '登录失败',
      location: 'middle'
    })
    errorCallback && errorCallback(error)
  })
}


export {
  http,
  appLogin,
  openUIInput,
  resetUIInputPosi,
  isPhoneNo,
  phoneNoFormat,
  loginSuccessCallback,
  ActionSheet,
  CityList,
  CitySelector,
  getPicture,
  initUIInput,
  getAndStorageAuthStatus,
  setRefreshHeaderInfo
}
