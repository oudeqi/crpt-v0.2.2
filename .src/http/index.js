import {
  openRegLogin,
} from './../webview.js'
import Utils from "./../utils"
import { baseUrl } from './config'

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

function ajax(method, url, data = {}, { headers = {}, tag = null, timeout = 20 } = {}) {
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
    let start = new Date().getTime()
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
      let end = new Date().getTime()
      let dis = (end - start) / 1000
      console.log('/************* ' + dis + 's **********/')
      if (ret) {
        if (ret.code === 200) {
          resolve(ret)
        } else {
          // 表单校验未过专属code
          if (ret.code === 202) {
            const data = ret.data
            data && Utils.UI.toast(data[0].msg)
            ret.msg && Utils.UI.toast(ret.msg)
            resolve(ret)
          } else {
            reject(ret)
          }
        }
      } else {
        if (error.statusCode === 500 && error.body.code === 216) {
          if (!hasAlert) {
            hasAlert = true
            api.alert({
              title: '提示',
              msg: '登录状态已经过期，请重新登录！',
            }, function (ret, err) {
              hasAlert = false
              api.closeWin({ name: 'html/register/index' })
              api.closeWin({ name: 'html/gerenlogin/index' })
              api.closeWin({ name: 'html/qiyelogin/index' })
              setTimeout(() => {
                $api.clearStorage()
                openRegLogin()
              }, 150)
            })
          }
          reject(error)
        }
        reject(error)
      }
      if (__buildEnv__ !== 'production') {
        if (ret) {
          console.log('/************* SUCCESS. **********/')
        } else {
          console.log('/************* ERROR. ************/')
        }
        console.log('__URL ==> ' + '[' + method + '] ' + baseUrl + url)
        console.log('__TOKEN ==> ' + token)
        console.log('__BODY ==> ' + JSON.stringify(data))
        console.log('__DATA ==> ' + JSON.stringify(ret || error))
      }
    })
  })
}

const http = {
  cancel: tag => api.cancelAjax({ tag }),
  get: (url, data, { headers, tag, timeout } = {}) => ajax('get', url, data, { headers, tag, timeout }),
  post: (url, data, { headers, tag, timeout } = {}) => ajax('post', url, data, { headers, tag, timeout }),
  put: (url, data, { headers, tag, timeout } = {}) => ajax('put', url, data, { headers, tag, timeout }),
  delete: (url, data, { headers, tag, timeout } = {}) => ajax('delete', url, data, { headers, tag, timeout }),
  upload: (url, data, { headers, tag, timeout } = {}) => ajax('upload', url, data, { headers, tag, timeout })
}

export default http