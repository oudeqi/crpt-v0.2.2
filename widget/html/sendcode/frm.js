// api.lockSlidPane();
/*
list: [{
  text: '',
  iconPath: 'widget://image/tabLayout/index.png',
  selectedIconPath: 'widget://image/tabLayout/index_active.png'
}, {
  text: '订单',
  iconPath: 'widget://image/tabLayout/order.png',
  selectedIconPath: 'widget://image/tabLayout/order_active.png'
}, {
  text: '还款',
  iconPath: 'widget://image/tabLayout/repay.png',
  selectedIconPath: 'widget://image/tabLayout/repay_active.png'
}, {
  text: '我的',
  iconPath: 'widget://image/tabLayout/mine.png',
  selectedIconPath: 'widget://image/tabLayout/mine_active.png'
}],
*/
// 导航布局


function openTabLayout(index) {
  api.openTabLayout({
    name: 'tabLayout',
    bgColor: '#fff',
    reload: true,
    delay: 300,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: {
      hideBackButton: true,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold' // leftButtons: [{
      //   // text: '设置',
      //   // color: '#fff',
      //   // fontSize: 16,
      //   iconPath: 'widget://image/avatar.png',
      // }],
      // rightButtons: [{
      //   text: '设置',
      //   color: '#fff',
      //   fontSize: 16,
      //   // iconPath: 'widget://image/settings@2x.png'
      // }]

    },
    tabBar: {
      animated: false,
      scrollEnabled: true,
      selectedColor: '#1dc4a2',
      color: '#bfbfbf',
      index: index || 0,
      // preload: 4,
      list: [{
        text: "首页",
        iconPath: "widget://image/tablayout/shouye.png",
        selectedIconPath: "widget://image/tablayout/shouye_active.png"
      }, {
        text: "订单",
        iconPath: "widget://image/tablayout/dingdan.png",
        selectedIconPath: "widget://image/tablayout/dingdan_active.png"
      }, {
        text: "还款",
        iconPath: "widget://image/tablayout/huankuan.png",
        selectedIconPath: "widget://image/tablayout/huankuan_active.png"
      }, {
        text: "我的",
        iconPath: "widget://image/tablayout/wode.png",
        selectedIconPath: "widget://image/tablayout/wode_active.png"
      }],
      frames: [{
        title: "首页",
        //tab切换时对应的标题
        name: "tablayout/index",
        url: "widget://html/index/frm.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }, {
        title: "订单",
        name: "tablayout/order",
        url: "widget://html/order/frm.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }, {
        title: "还款",
        name: "tablayout/repay",
        url: "widget://html/repay/frm.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }, {
        title: "我的",
        name: "tablayout/my",
        url: "widget://html/my/frm.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }]
    }
  });
} // 注册


function openRegLogin() {
  api.openWin({
    name: 'html/reglogin/win',
    url: 'widget://html/reglogin/win.html',
    bgColor: '#fff',
    reload: true,
    slidBackEnabled: false
  });
} // 个人登录


function openGerenLogin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$userType = _ref.userType,
      userType = _ref$userType === void 0 ? 1 : _ref$userType;

  // 2企业 1个人，
  api.openWin({
    name: 'html/gerenlogin/win',
    url: 'widget://html/gerenlogin/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      userType: userType
    }
  });
} // 企业登录


function openTodoAuthGeren() {
  api.openTabLayout({
    name: 'html/todoauthgeren/win',
    title: '待完成',
    url: 'widget://html/todoauthgeren/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: {
      hideBackButton: true,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
}

function openTodoAuthQiye() {
  api.openTabLayout({
    name: 'html/todoauthqiye/win',
    title: '待完成',
    url: 'widget://html/todoauthqiye/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: {
      hideBackButton: true,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 企业信息确认

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
var hasAlert = false;
var whiteList = [// 白名单里不带token，否则后端会报错
'/sms/smsverificationcode', '/identification/gainenterprisephone', '/identification/personregister', '/identification/enterpriseregister', '/identification/enterpriseregister', '/identification/getbackpassword', '/auth/oauth/token', '/auth/token/' // 退出登录
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
    var token = '';

    if (headers.token) {
      token = headers.token;
    } else {
      var userinfo = $api.getStorage('userinfo');
      token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    }

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
        if (error.statusCode === 500 && error.body.code === 216) {
          if (!hasAlert) {
            hasAlert = true;
            api.alert({
              title: '提示',
              msg: '登录状态已经过期，请重新登录！'
            }, function (ret, err) {
              hasAlert = false;
              api.closeWin({
                name: 'html/register/win'
              });
              api.closeWin({
                name: 'html/gerenlogin/win'
              });
              api.closeWin({
                name: 'html/qiyelogin/win'
              });
              setTimeout(function () {
                $api.clearStorage();
                openRegLogin();
              }, 150);
            });
          }
        }

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
};

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

var isPhoneNo = function isPhoneNo(phone) {
  return /^1[3456789]\d{9}$/.test(phone);
};

var phoneNoFormat = function phoneNoFormat(tel) {
  var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '****';
  var a = String(tel).substring(0, 3);
  var b = String(tel).substr(3, 4);
  var c = String(tel).substr(7, 4);

  if (tag === '****') {
    return a + tag + c;
  } else {
    return a + tag + b + tag + c;
  }
}; // let userinfo = {
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


var handleLoginSuccess = function handleLoginSuccess(data) {
  $api.setStorage('userinfo', data); // 用户信息
};

function getAuthStatus(token, cb) {
  // 认证状态 int
  // 1：正常
  // 2：待实名认证
  // 3：待人脸审核
  // 4：人脸认证失败，待人工审核
  // 5：待补充基本信息
  // 6：人工审核不通过
  http.get("/crpt-cust/customer/query/authstatus", null, {
    headers: {
      token: token
    }
  }).then(function (res) {
    $api.setStorage('authStatus', {
      status: res.data
    });
    cb(res.data);
  })["catch"](function (error) {
    api.toast({
      msg: error.msg || '获取认证状态失败'
    });
  });
}

apiready = function apiready() {
  var form = {}; // 表单数据

  var sendStatus = 'notsend'; // notsend:未发送,sending:发送中,countdown:倒计时中

  var submitStatus = 'notsubmit'; // notsubmit:未提交,submitting:正在提交

  var pageParam = api.pageParam || {};
  var tel = pageParam.tel,
      userType = pageParam.userType;
  openUIInput($api.byId('code'), form, 'code', {
    placeholder: '请输入...',
    keyboardType: 'done',
    maxStringLength: 6
  });

  if (tel && isPhoneNo(tel)) {
    $api.byId('tel').innerHTML = phoneNoFormat(tel);
  } else {
    $api.byId('tel').innerHTML = '';
  }

  var apLoginBtn = document.querySelector('#ap_login');

  if (userType === 1) {
    // 个人登录
    sendCode();
  } else {
    sendStatus = 'sending';
    countDown();
  }

  function countDown() {
    var second = 60;
    sendStatus = 'countdown';
    $api.removeCls($api.byId('sendcode'), 'loading');
    $api.byId('sendcode').innerHTML = second + '秒后重试';
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

  function sendCode() {
    if (sendStatus === 'notsend') {
      sendStatus = 'sending';
      $api.byId('sendcode').innerHTML = '正在发送中...';
      $api.addCls($api.byId('sendcode'), 'loading');
      http.post('/crpt-cust/sms/smsverificationcode', {
        body: {
          phone: tel
        }
      }).then(function (ret) {
        countDown();
      })["catch"](function (error) {
        sendStatus = 'notsend';
        $api.removeCls($api.byId('sendcode'), 'loading');
        $api.byId('sendcode').innerHTML = '发送验证码';
        api.toast({
          msg: error.msg || '发送验证码失败',
          location: 'middle'
        });
      });
    }
  }

  document.querySelector('#sendcode').onclick = function () {
    sendCode();
  };

  if (userType === 2) {
    apLoginBtn.onclick = function () {
      openGerenLogin({
        userType: 2
      });
    };
  } else {
    // 个人登录时隐藏账密登录提示
    apLoginBtn.style.display = 'none';
  }

  document.querySelector('#login').onclick = function () {
    if (submitStatus === 'notsubmit') {
      var code = form['code'][1];

      if (!code) {
        return api.toast({
          msg: '请输入验证码'
        });
      }

      submitStatus = 'submitting';
      $api.addCls($api.byId('login'), 'loading');
      var body = {
        userType: userType,
        // 1个人用户登录，2企业用户登录
        username: tel,
        loginType: 2,
        // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
        verification: code,
        password: tel,
        // 在验证码登录的时候，密码必须设置为手机号码
        loginDevice: api.deviceId,
        // 客户手机设备号(android-imei,IOS-??)
        ipAddress: '',
        latitude: '',
        longitude: '',
        terminal_version: api.systemVersion,
        // 系统终端版本
        location: '',
        // 最近登录地点
        grant_type: 'password',
        // 固定传password
        scope: 'app',
        // 固定传app
        client_id: 'client',
        // client
        client_secret: 'secret' // 固定传secret

      };
      http.post('/auth/oauth/token', {
        values: body
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function (ret) {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('login'), 'loading');
        api.toast({
          msg: '登录成功',
          location: 'middle',
          global: true
        });
        var userinfo = ret || {};
        var userType = userinfo.userType;
        var token = userinfo.token_type + ' ' + userinfo.access_token;
        getAuthStatus(token, function (status) {
          // 认证状态 int
          // 1：正常
          // 2：待实名认证
          // 3：待人脸审核
          // 4：人脸认证失败，待人工审核
          // 5：待补充基本信息
          // 6：人工审核不通过
          handleLoginSuccess(userinfo);

          if (status === 1) {
            openTabLayout();
          } else {
            if (userType === '1') {
              openTodoAuthGeren();
            } else {
              openTodoAuthQiye();
            }
          }
        });
      })["catch"](function (error) {
        api.toast({
          msg: error.msg || '登录失败',
          location: 'middle'
        });
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('login'), 'loading');
      });
    }
  };
};
