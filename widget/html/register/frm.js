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

// const baseUrl = 'http://crptdev.liuheco.com'
var dev = 'http://crptdev.liuheco.com';
var baseUrl =  dev ;

var ajax = function ajax(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? null : _ref$tag,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 15 : _ref$timeout;

  return new Promise(function (resolve, reject) {
    var userinfo = $api.getStorage('userinfo');
    var token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    var contentType = {
      'Content-Type': 'application/json;charset=utf-8'
    };
    method === 'upload' ? contentType = {} : null;
    api.ajax({
      url: baseUrl + url,
      method: method,
      data: data,
      tag: tag,
      timeout: timeout,
      headers: _objectSpread2({
        'Authorization': token
      }, contentType, {}, headers)
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
// const getUIInputIndex = i => api.systemType === 'ios' ? i - 1 : i

var resetUIInputPosi = function resetUIInputPosi(dom, id) {
  var UIInput = api.require('UIInput');

  var rect = $api.offset(dom);
  UIInput.resetPosition({
    id: id,
    position: {
      x: rect.l,
      y: rect.t
    }
  });
};

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
  var UIInput = api.require('UIInput');

  var form = {}; // 表单数据

  var type = 'geren'; // qiye

  var sendStatus = 'notsend'; // notsend:未发送,sending:发送中,countdown:倒计时中

  var submitStatus = 'notsubmit'; // notsubmit:未提交,submitting:正在提交

  openUIInput($api.byId('tel'), form, 'tel', {
    placeholder: '请输入手机号码',
    keyboardType: 'number',
    maxStringLength: 11
  });
  openUIInput($api.byId('code'), form, 'code', {
    placeholder: '短信验证码',
    keyboardType: 'next',
    maxStringLength: 6
  });
  openUIInput($api.byId('pwd'), form, 'pwd', {
    placeholder: '请输入密码',
    keyboardType: 'next',
    inputType: 'password',
    maxStringLength: 16
  });
  openUIInput($api.byId('repwd'), form, 'repwd', {
    placeholder: '请输入密码',
    keyboardType: 'done',
    inputType: 'password',
    maxStringLength: 16
  });

  function resetInputPosi() {
    resetUIInputPosi($api.byId('tel'), form['tel'][0]);
    resetUIInputPosi($api.byId('code'), form['code'][0]);
    resetUIInputPosi($api.byId('pwd'), form['pwd'][0]);
    resetUIInputPosi($api.byId('repwd'), form['repwd'][0]);
  }

  function radioOnChange() {
    if (this.dataset.type === 'geren') {
      $api.byId('companyName').style.display = 'none';
      UIInput.hide({
        id: form['name'][0]
      });
      type = 'geren';
      resetInputPosi();
    } else {
      $api.byId('companyName').style.display = 'block';
      type = 'qiye';
      setTimeout(function () {
        if (form['name']) {
          UIInput.show({
            id: form['name'][0]
          });
        } else {
          openUIInput($api.byId('name'), form, 'name', {
            placeholder: '请输入...',
            isCenterVertical: false,
            maxRows: 2,
            keyboardType: 'next',
            maxStringLength: 40
          });
        }
      }, 150);
      resetInputPosi();
    }
  }

  document.querySelector('#geren').onclick = radioOnChange;
  document.querySelector('#qiye').onclick = radioOnChange;

  document.querySelector('#agreement').onclick = function () {
    api.alert({
      title: '消息',
      msg: '功能开发中...'
    });
  };

  function countDown() {
    var second = 60;
    var timer = setInterval(function () {
      if (second <= 0) {
        sendStatus = 'notsend';
        $api.byId('sendcode').innerHTML = '发送验证码';
        clearInterval(timer);
      } else {
        second--;
        $api.byId('sendcode').innerHTML = second + '秒后重试';
      }
    }, 1000);
  }

  document.querySelector('#sendcode').onclick = function () {
    if (sendStatus === 'notsend') {
      var tel = form['tel'][1];

      if (!tel) {
        return api.toast({
          msg: '请输入手机号码'
        });
      }

      sendStatus = 'sending';
      $api.byId('sendcode').innerHTML = '正在发送中...';
      http.post('/crpt-cust/sms/smsverificationcode', {
        body: {
          phone: tel
        }
      }).then(function (ret) {
        sendStatus = 'countdown';
        countDown();
      })["catch"](function (error) {
        sendStatus = 'notsend';
        $api.byId('sendcode').innerHTML = '发送验证码';
      });
    }
  };

  document.querySelector('#submit').onclick = function () {
    var personRegister = '/crpt-cust/identification/personregister';
    var enterpriseRegister = '/crpt-cust/identification/enterpriseregister';
    var url = type === 'geren' ? personRegister : enterpriseRegister;

    if (submitStatus === 'notsubmit') {
      if (type === 'qiye' && !form['name'][1]) {
        return api.toast({
          msg: '请输入企业全称'
        });
      }

      if (!form['tel'][1]) {
        return api.toast({
          msg: '请输入手机号码'
        });
      }

      if (!form['code'][1]) {
        return api.toast({
          msg: '请输入验证码'
        });
      }

      if (!form['pwd'][1]) {
        return api.toast({
          msg: '请输入密码'
        });
      }

      if (form['pwd'][1] !== form['repwd'][1]) {
        return api.toast({
          msg: '两次密码输入不一致'
        });
      }

      if (!$api.byId('checkbox').checked) {
        return api.toast({
          msg: '请仔细阅读，并同意协议'
        });
      }

      submitStatus = 'submitting';
      var body = {
        phone: form['tel'][1],
        password: form['pwd'][1],
        confirmPassword: form['repwd'][1],
        verification: form['code'][1]
      };

      if (type === 'qiye') {
        body.name = form['name'][1];
      }

      $api.addCls($api.byId('submit'), 'loading');
      http.post(url, {
        body: body
      }).then(function (ret) {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('submit'), 'loading');
        api.toast({
          msg: '注册成功',
          location: 'middle',
          global: true
        });
        api.closeWin();
      })["catch"](function (error) {
        api.toast({
          msg: '注册失败：' + error.msg,
          location: 'middle'
        });
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('submit'), 'loading');
      });
    }
  };
};
