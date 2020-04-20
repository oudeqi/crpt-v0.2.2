// api.lockSlidPane();


function openBaseinfoFill(pageParam) {
  api.openWin({
    name: 'html/baseinfofill/win',
    url: 'widget://html/baseinfofill/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam
  });
} // 打开待认证


function openCompanyInfo() {
  api.openTabLayout({
    name: 'html/companyinfo/win',
    title: '企业实名认证',
    url: 'widget://html/companyinfo/win.html',
    bgColor: '#fff',
    reload: true,
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
} // 身份证上传


function openFaceAuth() {
  var pageParam = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  api.openTabLayout({
    name: 'html/faceauth/win',
    title: pageParam.title,
    url: 'widget://html/faceauth/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: pageParam,
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
} // 手持身份证上传


function openYuguEdu() {
  api.openTabLayout({
    name: 'html/yuguedu/win',
    title: '预估额度',
    url: 'widget://html/yuguedu/win.html',
    bgColor: '#fff',
    reload: true,
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
} // 认证结果

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
      timeout = _ref$timeout === void 0 ? 15 : _ref$timeout;

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

apiready = function apiready() {
  var userinfo = $api.getStorage('userinfo');
  var userType = userinfo.userType;

  function getStatus(cb) {
    api.showProgress({
      title: '加载中...',
      text: '',
      modal: false
    });
    http.get("/crpt-cust/customer/query/authstatus").then(function (res) {
      api.hideProgress();
      var mapping = {
        // 0未通过，1通过，2人工审核
        realAuth: {
          status: 0,
          msg: ''
        },
        faceAuth: {
          status: 0,
          msg: ''
        },
        baseinfo: {
          status: 0,
          msg: ''
        }
      }; // 认证状态 int
      // 1：正常
      // 2：待实名认证
      // 3：待人脸审核
      // 4：人脸认证失败，待人工审核
      // 5：待补充基本信息
      // 6：人工审核不通过

      var status = res.data;

      if (status === 1) {
        // 认证全部通过
        mapping.realAuth.status = 1;
        mapping.faceAuth.status = 1;
        mapping.baseinfo.status = 1;
      } else if (status === 3) {
        //待人脸审核
        mapping.realAuth.status = 1;
      } else if (status === 4) {
        // 人脸认证失败，待人工审核
        mapping.realAuth.status = 1;
        mapping.faceAuth.status = 2;
      } else if (status === 5) {
        // 待补充基本信息
        mapping.realAuth.status = 1;
        mapping.faceAuth.status = 1;
      } else if (status === 6) {
        // 6：人工审核不通过
        mapping.realAuth.status = 1;
        mapping.faceAuth.status = 3;
      }

      cb(mapping);
    })["catch"](function (error) {
      api.hideProgress();
      api.toast({
        msg: error.msg || '获取认证状态失败'
      });
    });
  }

  function renderStep1(status) {
    if (status === 0) {
      $api.byId('step1').innerHTML = "\n        <div class=\"auth-block\" tapmode=\"active\" id=\"companyInfo\">\n          <div class=\"badge\">1</div>\n          <div class=\"text\">\n            <div>\n              <strong>\u4F01\u4E1A\u5B9E\u540D\u8BA4\u8BC1</strong>\n              <span class=\"icon\"></span>\n            </div>\n            <p>\u8BF7\u51C6\u5907\u6CD5\u5B9A\u4EE3\u8868\u4EBA\u7684\u4E8C\u4EE3\u8EAB\u4EFD\u8BC1</p>\n          </div>\n          <div class=\"pic idcard\"></div>\n        </div>\n      ";
    } else {
      $api.byId('step1').innerHTML = "\n        <div class=\"auth-block2 authpass\" id=\"companyInfoResult\">\n          <div class=\"badge\">1</div>\n          <div class=\"text\">\n            <strong>\u5B9E\u540D\u8BA4\u8BC1</strong>\n          </div>\n          <div class=\"pic\"></div>\n          <span>\u901A\u8FC7</span>\n        </div>\n      ";
    }
  }

  function renderStep2(status) {
    if (status === 0) {
      $api.byId('step2').innerHTML = "\n        <div class=\"auth-block\" tapmode=\"active\" id=\"faceAuth\">\n          <div class=\"badge\">2</div>\n          <div class=\"text\">\n            <div>\n              <strong>\u6CD5\u5B9A\u4EE3\u8868\u4EBA\u8FDB\u884C\u4EBA\u8138\u8BA4\u8BC1</strong>\n              <span class=\"icon\"></span>\n            </div>\n            <p>\u9700\u8981\u6CD5\u5B9A\u4EE3\u8868\u4EBA\u672C\u4EBA\u5B8C\u6210\u4EBA\u8138\u8BA4\u8BC1</p>\n          </div>\n          <div class=\"pic facescan\"></div>\n          ".concat(status === 1 ? '<span>通过</span>' : '', "\n        </div>\n      ");
    } else {
      // autherror
      var type = 'authpass';

      if (status === 2) {
        type = 'authing';
      }

      if (status === 3) {
        type = 'autherror';
      } // <span>图片模糊</span>


      $api.byId('step2').innerHTML = "\n        <div class=\"auth-block2 ".concat(type, "\" id=\"faceAuthResult\">\n          <div class=\"badge\">2</div>\n          <div class=\"text\">\n            <strong>\u6CD5\u5B9A\u4EE3\u8868\u4EBA\u8138\u8BA4\u8BC1</strong>\n          </div>\n          <div class=\"pic\"></div>\n          ").concat(status === 1 ? '<span>通过</span>' : status === 3 ? '<span>人工审核失败<br />请联系客服</span>' : '', "\n        </div>\n      ");
    }
  }

  function renderStep3(status) {
    if (status === 0) {
      $api.byId('step3').innerHTML = "\n        <div class=\"auth-block\" tapmode=\"active\" id=\"baseinfo\">\n          <div class=\"badge\">3</div>\n          <div class=\"text\">\n            <div>\n              <strong>\u8865\u5145\u57FA\u7840\u4FE1\u606F</strong>\n              <span class=\"icon\"></span>\n            </div>\n            <p>\u8BF7\u586B\u5199\u6CD5\u5B9A\u4EE3\u8868\u4EBA\u7684\u57FA\u7840\u4FE1\u606F</p>\n          </div>\n          <div class=\"pic baseinfo\"></div>\n        </div>\n      ";
    } else {
      $api.byId('step3').innerHTML = "\n        <div class=\"auth-block2 authpass\" id=\"baseinfoResult\">\n          <div class=\"badge\">3</div>\n          <div class=\"text\">\n            <strong>\u8865\u5145\u57FA\u672C\u4FE1\u606F</strong>\n          </div>\n          <div class=\"pic\"></div>\n          <span>\u6210\u529F</span>\n        </div>\n      ";
    }
  }

  function bindEvent(mapping) {
    api.parseTapmode();
    var companyInfo = document.querySelector('#companyInfo');
    var faceAuth = document.querySelector('#faceAuth');
    var baseinfo = document.querySelector('#baseinfo');
    var yuguedu = document.querySelector('#yuguedu');

    if (companyInfo) {
      companyInfo.onclick = function () {
        openCompanyInfo();
      };
    }

    if (faceAuth) {
      faceAuth.onclick = function () {
        if (mapping.realAuth.status === 1) {
          openFaceAuth({
            userType: userType,
            // userType === '1' ? '个人账号' : '企业账号'
            title: '人脸认证'
          });
        } else {
          api.toast({
            msg: '请先完成第一步'
          });
        }
      };
    }

    if (baseinfo) {
      baseinfo.onclick = function () {
        if (mapping.realAuth.status === 0) {
          api.toast({
            msg: '请先完成第一步'
          });
          return;
        }

        if (mapping.faceAuth.status === 0 || mapping.faceAuth.status === 2) {
          api.toast({
            msg: '请先完成第二步'
          });
          return;
        }

        openBaseinfoFill();
      };
    }

    if (yuguedu) {
      yuguedu.onclick = function () {
        openYuguEdu();
      };
    }
  }

  function initPage() {
    getStatus(function (mapping) {
      // 0未通过，1通过，2人工审核
      var step = 3;
      mapping.realAuth.status === 1 ? step = 2 : null;
      mapping.faceAuth.status === 1 ? step = 1 : null;
      mapping.baseinfo.status === 1 ? step = 0 : null;

      if (step > 0) {
        $api.byId('tips').innerHTML = "\u5B8C\u6210\u4EE5\u4E0B<strong>".concat(step, "\u6B65</strong>\uFF0C\u5373\u53EF\u83B7\u5F97\u7533\u8BF7\u989D\u5EA6\u8D44\u683C");
      } else if (step === 0) {
        $api.byId('yugueduContainer').innerHTML = "\n          <div class=\"smile\"></div>\n          <div class=\"btn-box\">\n            <div class=\"app_btn\" tapmode=\"active\" id=\"yuguedu\">\u7ACB\u5373\u9884\u4F30\u989D\u5EA6</div>\n          </div>\n        ";
      }

      renderStep1(mapping.realAuth.status);
      renderStep2(mapping.faceAuth.status);
      renderStep3(mapping.baseinfo.status);
      bindEvent(mapping);
    });
  }

  api.addEventListener({
    name: 'viewappear'
  }, function (ret, err) {
    initPage();
  });
};
