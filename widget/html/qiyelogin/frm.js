function openReg() {
  api.openWin({
    name: 'html/register/win',
    url: 'widget://html/register/win.html',
    bgColor: '#fff'
  });
} // 注册登录选择


function openSendCode(pageParam) {
  api.openWin({
    name: 'html/sendcode/win',
    url: 'widget://html/sendcode/win.html',
    bgColor: '#fff',
    pageParam: pageParam
  });
} // 找回密码

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var baseUrl = 'http://crptdev.liuheco.com'; // const baseUrl = 'http://crptuat.liuheco.com'

var ajax = function ajax(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? null : _ref$tag,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 10 : _ref$timeout;

  return new Promise(function (resolve, reject) {
    console.log(baseUrl + url);
    var userinfo = $api.getStorage('userinfo'); // {
    //   "access_token":"6ca22146-008e-4c12-9772-8d72229b731b",
    //   "token_type":"bearer",
    //   "refresh_token":"6509c5e3-b3d5-4725-9f1b-89b5f548d444",
    //   "expires_in":594349,
    //   "scope":"app",
    //   "msg":"6ca22146-008e-4c12-9772-8d72229b731b",
    //   "code":200,
    //   "data":"6ca22146-008e-4c12-9772-8d72229b731b",
    //   "name":"欧威",
    //   "userType":"1",
    //   "makeBy":"nh-cloud",
    //   "userId":"20"
    // }

    var token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    console.log(JSON.stringify(token));
    api.ajax({
      url: baseUrl + url,
      method: method,
      data: data,
      tag: tag,
      timeout: timeout,
      headers: _objectSpread2({
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': token
      }, headers)
    }, function (ret, err) {
      if (ret) {
        console.log(JSON.stringify(ret));
        resolve(ret);
      } else {
        console.log(JSON.stringify(err));
        reject(err);
      }
    });
  });
}; // if (ret && ret.statusCode === 500 && ret.body.code === 216) {
//   api.toast({
//     msg: '登录状态已经过期，请重新登录！',
//     duration: 2000,
//     location: 'middle'
//   })
// }


var handleRet = function handleRet(ret) {
  if (ret && ret.code === 200) {
    return ret;
  } else {
    throw new Error(ret.msg);
  }
};

var _upload = function upload(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref2 = arguments.length > 2 ? arguments[2] : undefined,
      _ref2$headers = _ref2.headers,
      headers = _ref2$headers === void 0 ? {} : _ref2$headers,
      _ref2$tag = _ref2.tag,
      tag = _ref2$tag === void 0 ? null : _ref2$tag,
      _ref2$timeout = _ref2.timeout,
      timeout = _ref2$timeout === void 0 ? 30 : _ref2$timeout;

  return new Promise(function (resolve, reject) {
    console.log(baseUrl + url);
    var userinfo = $api.getStorage('userinfo');
    var token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    console.log(JSON.stringify(token));
    api.ajax({
      url: baseUrl + url,
      method: 'post',
      data: data,
      tag: tag,
      headers: _objectSpread2({
        'Authorization': token
      }, headers),
      timeout: timeout
    }, function (ret, err) {
      if (ret) {
        console.log(JSON.stringify(ret));
        resolve(ret);
      } else {
        console.log(JSON.stringify(err));
        reject(err);
      }
    });
  });
};

var http = {
  cancel: function cancel(tag) {
    return api.cancelAjax({
      tag: tag
    });
  },
  get: function get(url, data) {
    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref3.headers,
        tag = _ref3.tag,
        timeout = _ref3.timeout;

    return ajax('get', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  },
  post: function post(url, data) {
    var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref4.headers,
        tag = _ref4.tag,
        timeout = _ref4.timeout;

    return ajax('post', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  },
  put: function put(url, data) {
    var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref5.headers,
        tag = _ref5.tag,
        timeout = _ref5.timeout;

    return ajax('put', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  },
  "delete": function _delete(url, data) {
    var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref6.headers,
        tag = _ref6.tag,
        timeout = _ref6.timeout;

    return ajax('delete', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  },
  upload: function upload(url, data) {
    var _ref7 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref7.headers,
        tag = _ref7.tag,
        timeout = _ref7.timeout;

    return _upload(url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  }
}; // 统一ios和android的输入框，下标都从0开始

var openUIInput = function openUIInput(dom, form, key) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var cb = arguments.length > 4 ? arguments[4] : undefined;

  var UIInput = api.require('UIInput');

  var rect = $api.offset(dom);
  var maxRows = options.maxRows,
      maxStringLength = options.maxStringLength,
      inputType = options.inputType,
      placeholder = options.placeholder,
      keyboardType = options.keyboardType,
      alignment = options.alignment,
      isCenterVertical = options.isCenterVertical;
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
    maxStringLength: maxStringLength,
    inputType: inputType,
    placeholder: placeholder,
    keyboardType: keyboardType,
    alignment: alignment,
    isCenterVertical: isCenterVertical,
    fixedOn: api.frameName,
    styles: {
      bgColor: 'rgba(0,0,0,0)',
      size: 16,
      color: '#333',
      placeholder: {
        color: '#aaa'
      }
    }
  }, function (ret) {
    cb && cb(ret.id);
    UIInput.value({
      id: ret.id
    }, function (value) {
      form[key] = [ret.id, value && value.msg ? value.msg : ''];
    });
  });
};

apiready = function apiready() {
  // 表单数据
  var form = {};
  var submitStatus = 'notsubmit'; // notsubmit:未提交,submitting:正在提交

  openUIInput($api.byId('name'), form, 'name', {
    placeholder: '请输入...',
    isCenterVertical: false,
    maxRows: 2,
    keyboardType: 'done',
    maxStringLength: 40
  });

  document.querySelector('#register').onclick = function () {
    openReg();
  };

  document.querySelector('#tel_login').onclick = function () {
    if (submitStatus === 'notsubmit') {
      var companyName = form['name'][1];

      if (companyName) {
        qiyeSendCode(companyName);
      } else {
        api.toast({
          msg: '请输入公司全称'
        });
      }
    }
  };

  function qiyeSendCode(companyName) {
    submitStatus = 'submitting';
    $api.addCls($api.byId('tel_login'), 'loading');
    http.post('/crpt-cust/identification/gainenterprisephone', {
      body: {
        account: companyName
      }
    }).then(function (res) {
      submitStatus = 'notsubmit';
      $api.removeCls($api.byId('tel_login'), 'loading');

      if (res.data) {
        openSendCode({
          tel: res.data,
          loginType: 'qiye'
        });
      } else {
        api.toast({
          msg: '获取企业法人手机号失败'
        });
      }
    })["catch"](function (error) {
      api.toast({
        msg: '获取企业法人手机号失败'
      });
      submitStatus = 'notsubmit';
      $api.removeCls($api.byId('tel_login'), 'loading');
    });
  }
};
