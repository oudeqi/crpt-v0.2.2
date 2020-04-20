// api.lockSlidPane();


function openAuthResult(status, message, title) {
  // status: success error during
  api.openTabLayout({
    name: 'html/authresult/win',
    title: title || '认证结果',
    url: 'widget://html/authresult/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      status: status,
      title: title,
      message: message
    },
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 消息中心

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

var defineProperty = _defineProperty;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var uat = 'http://crptuat.liuheco.com';
var baseUrl =   uat ;
var whiteList = ['/sms/smsverificationcode', '/identification/gainenterprisephone', '/identification/personregister', '/identification/enterpriseregister', '/identification/enterpriseregister', '/identification/getbackpassword', '/auth/oauth/token', '/auth/token/' // 退出登录
];

var ajax = function ajax(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? null : _ref$tag,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 60 : _ref$timeout;

  var include = whiteList.find(function (value) {
    return url.includes(value);
  });
  return new Promise(function (resolve, reject) {
    var userinfo = $api.getStorage('userinfo');
    var token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    var contentType = {
      'Content-Type': 'application/json;charset=utf-8'
    };
    var Authorization = {
      Authorization: token
    };
    method === 'upload' ? contentType = {} : null;
    include ? Authorization = {} : null;
    api.ajax({
      url: baseUrl + url,
      method: method === 'upload' ? 'post' : method,
      data: data,
      tag: tag,
      timeout: timeout,
      headers: _objectSpread({}, Authorization, {}, contentType, {}, headers)
    }, function (ret, error) {
      if (ret) {
        if (ret.code === 200) {
          resolve(ret);
        } else {
          reject(ret);
        }
      } else {
        reject(error);
      }

      {
        if (ret) {
          console.log('/************* SUCCESS. **********/');
        } else {
          console.log('/************* ERROR. ************/');
        }

        console.log('__URL ==> ' + baseUrl + url);
        console.log('__TOKEN ==> ' + token);
        console.log('__BODY ==> ' + JSON.stringify(data));
        console.log('__DATA ==> ' + JSON.stringify(ret || error));
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


var http = {
  cancel: function cancel(tag) {
    return api.cancelAjax({
      tag: tag
    });
  },
  get: function get(url, data) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref2.headers,
        tag = _ref2.tag,
        timeout = _ref2.timeout;

    return ajax('get', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  post: function post(url, data) {
    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref3.headers,
        tag = _ref3.tag,
        timeout = _ref3.timeout;

    return ajax('post', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  put: function put(url, data) {
    var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref4.headers,
        tag = _ref4.tag,
        timeout = _ref4.timeout;

    return ajax('put', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  "delete": function _delete(url, data) {
    var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref5.headers,
        tag = _ref5.tag,
        timeout = _ref5.timeout;

    return ajax('delete', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  },
  upload: function upload(url, data) {
    var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref6.headers,
        tag = _ref6.tag,
        timeout = _ref6.timeout;

    return ajax('upload', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    });
  }
}; // 统一ios和android的输入框，下标都从0开始

function initUIInput(dom) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments.length > 2 ? arguments[2] : undefined;

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
    UIInput.value({
      id: ret.id
    }, function (value) {
      if (value) {
        cb && cb(value.msg);
      }
    });
  });
}

apiready = function apiready() {
  var submitStatus = 'notsubmit'; // notsubmit:未提交,submitting:正在提交
  // let idcard = {
  //   "code":200,
  //   "msg":"",
  //   "data":{
  //     "name":"周永刚",
  //     "gender":"男",
  //     "number":"622424199409270411",
  //     "birthday":"1994-09-27",
  //     "address":"甘肃省通渭县平襄镇瓦石村高家庄社45号",
  //     "nation":"汉",
  //     "authority":"通渭县公安局",
  //     "timelimit":"20110125-20210125"
  //   }
  // }

  var pageParam = api.pageParam || {};
  var name = pageParam.name,
      gender = pageParam.gender,
      number = pageParam.number,
      birthday = pageParam.birthday,
      address = pageParam.address,
      nation = pageParam.nation,
      authority = pageParam.authority,
      timelimit = pageParam.timelimit,
      front = pageParam.front,
      back = pageParam.back;
  initUIInput($api.byId('name'), {
    placeholder: '请输入',
    keyboardType: 'done',
    maxStringLength: 10
  }, function (value) {
    name = value;
  }); // $api.byId('name').innerHTML = name

  var UIInput = api.require('UIInput');

  var iptIndex = api.systemType === 'ios' ? 1 : 0;
  UIInput.insertValue({
    index: iptIndex,
    msg: name || ''
  });
  $api.byId('number').innerHTML = number || '';
  $api.byId('authority').innerHTML = authority || '';
  $api.byId('timelimit').innerHTML = timelimit || '';
  $api.byId('nation').innerHTML = nation || '';
  $api.byId('address').innerHTML = address || '';
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.index === 0) {
      api.closeWin();
    }
  });

  document.querySelector('#retry').onclick = function () {
    api.closeWin();
  };

  document.querySelector('#next').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!name) {
        return api.toast({
          msg: '请输入姓名'
        });
      }

      if (!gender || !number || !birthday || !address || !nation || !authority || !timelimit) {
        return api.toast({
          msg: '未完全识别，请重新上传'
        });
      }

      if (!$api.byId('checkbox').checked) {
        return api.toast({
          msg: '请仔细阅读，并同意协议'
        });
      }

      submitStatus = 'submitting';
      $api.addCls($api.byId('next'), 'loading');
      http.upload('/crpt-cust/saas/realnameauth', {
        values: {
          name: name,
          gender: gender,
          number: number,
          birthday: birthday,
          address: address,
          nation: nation,
          authority: authority,
          timelimit: timelimit
        },
        files: {
          certImageFront: front,
          certImageBack: back
        }
      }).then(function (ret) {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('next'), 'loading');

        if (ret.data.result === 'NO') {
          api.toast({
            msg: ret.data.info || '实名认证失败'
          });
        } else {
          openAuthResult('success');
        }
      })["catch"](function (error) {
        api.toast({
          msg: error.msg || '实名认证失败'
        });
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('next'), 'loading');
      });
    }
  };
};
