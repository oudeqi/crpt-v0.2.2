const baseUrl = 'http"//www.baidu.com'

const ajax = ({ url, method, headers = {}, data = {}, tag = null }) => new Promise((resolve, reject) => {
  api.ajax({
    url: baseUrl + url,
    method,
    data,
    tag,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      // 'Authorization': userinfo.token,
      ...headers
    }
  }, function(ret, err) {
    if (err) {
      reject(err)
    } else {
      resolve(ret)
    }
  })
})

const handleRet = () => {
  if (ret.code === 0) {
    return ret
  } else {
    return new Error(ret.message)
  }
}

const http = {
  cancel: tag => api.cancelAjax({ tag }),
  get: (url, { headers, data, tag } = {}) => ajax({ url, method: 'get', headers, data, tag }).then(ret => handleRet(ret)),
  post: (url, { headers, data, tag } = {}) => ajax({ url, method: 'post', headers, data, tag }).then(ret => handleRet(ret)),
  put: (url, { headers, data, tag } = {}) => ajax({ url, method: 'put', headers, data, tag }).then(ret => handleRet(ret)),
  delete: (url, { headers, data, tag } = {}) => ajax({ url, method: 'delete', headers, data, tag }).then(ret => handleRet(ret)),
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
    // cb && cb(ret.id)
    UIInput.value({ id: ret.id }, function(value) {
      form[key] = [ ret.id, value && value.msg ? value.msg : '' ]
    })
  })
}


export { http, openUIInput, resetUIInputPosi }
