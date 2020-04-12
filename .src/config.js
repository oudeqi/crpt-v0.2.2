// const baseUrl = 'http://crptdev.liuheco.com'
const dev = 'http://crptdev.liuheco.com'
const uat = 'http://crptuat.liuheco.com'
const prod = 'http://crptuat.liuheco.com'
const baseUrl = __buildEnv__ === 'development' ? dev : __buildEnv__ === 'testing' ? uat : prod

const ajax = (method, url, data = {}, {headers = {}, tag = null, timeout = 15} = {}) => {
  return new Promise((resolve, reject) => {
    let userinfo = $api.getStorage('userinfo')
    let token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : ''
    let contentType = {
      'Content-Type': 'application/json;charset=utf-8'
    }
    method === 'upload' ? contentType = {} : null
    api.ajax({
      url: baseUrl + url,
      method,
      data,
      tag,
      timeout,
      headers: {
        'Authorization': token,
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
        reject(error)
      }
      if (__buildEnv__ === 'development') {
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

// if (ret && ret.statusCode === 500 && ret.body.code === 216) {
//   api.toast({
//     msg: '登录状态已经过期，请重新登录！',
//     duration: 2000,
//     location: 'middle'
//   })
// }

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

const handleLoginSuccess = data => {
  $api.setStorage('userinfo', data)
}

export { http, openUIInput, resetUIInputPosi, isPhoneNo, handleLoginSuccess }
