// api.lockSlidPane();


function openRegLogin() {
  api.openWin({
    name: 'html/reglogin/win',
    url: 'widget://html/reglogin/win.html',
    bgColor: '#fff',
    reload: true,
    slidBackEnabled: false
  });
} // 个人登录


function openBaseinfoFill() {
  api.openTabLayout({
    name: 'html/baseinfofill/frm',
    title: '补充基本信息',
    url: 'widget://html/baseinfofill/frm.html',
    bgColor: '#fff',
    softInputMode: 'auto',
    softInputBarEnabled: false,
    softInputDismissMode: ['tap', 'interactive'],
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 打开待认证


function openIDcardUpload() {
  api.openTabLayout({
    name: 'html/idcardupload/win',
    title: '身份证上传',
    url: 'widget://html/idcardupload/win.html',
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
} // 确认身份证信息


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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var base64 = createCommonjsModule(function (module, exports) {
(function (global, factory) {
     module.exports = factory(global)
        ;
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal
: commonjsGlobal
), function(global) {
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.5.2";
    // if node.js and NOT React Native, we use Buffer
    var buffer;
    if ( module.exports) {
        try {
            buffer = eval("require('buffer').Buffer");
        } catch (err) {
            buffer = undefined;
        }
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function(u) {
        var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
        return isUint8Array ? u.toString('base64')
            : btoa(utob(String(u)));
    };
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(u)
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
        ? function(a) {
            return (a.constructor === buffer.constructor
                    ? a : buffer.from(a, 'base64')).toString();
        }
        : function(a) {
            return (a.constructor === buffer.constructor
                    ? a : new buffer(a, 'base64')).toString();
        }
        : function(a) { return btou(_atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        __buffer__: buffer
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if ( module.exports) {
        module.exports.Base64 = global.Base64;
    }
    // that's it!
    return {Base64: global.Base64}
}));
});
var base64_1 = base64.Base64;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var uat = 'http://crptuat.liuheco.com';
var baseUrl =   uat ;
var whiteList = [// 白名单里不带token，否则后端会报错
'/sms/smsverificationcode', '/identification/gainenterprisephone', '/identification/personregister', '/identification/enterpriseregister', '/identification/enterpriseregister', '/identification/getbackpassword', '/auth/oauth/token', '/auth/token/' // 退出登录
];
var hasAlert = false;

function ajax(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? null : _ref$tag,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 30 : _ref$timeout;

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
    var include = whiteList.find(function (value) {
      return url.includes(value);
    });
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
}

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

function getAndStorageAuthStatus(successCallback, errorCallback) {
  // 认证状态 int
  // 1：正常
  // 2：待实名认证
  // 3：待人脸审核
  // 4：人脸认证失败，待人工审核
  // 5：待补充基本信息
  // 6：人工审核不通过
  http.get("/crpt-cust/customer/query/authstatus").then(function (res) {
    try {
      $api.setStorage('authStatus', {
        status: res.data
      });
      successCallback && successCallback(res.data);
    } catch (e) {
      console.log(JSON.stringify(e));
    } finally {}
  })["catch"](function (error) {
    api.toast({
      msg: error.msg || '获取认证状态失败'
    });
    errorCallback && errorCallback(error);
  });
}

function setRefreshHeaderInfo(successCallback, errorCallback) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  api.setRefreshHeaderInfo(_objectSpread({
    // loadingImg: 'widget://image/refresh.png',
    bgColor: 'rgba(0,0,0,0)',
    textColor: '#bfbfbf',
    textDown: '下拉刷新',
    textUp: '松开刷新',
    textLoading: '加载中...',
    showTime: false
  }, options), function (ret, error) {
    if (error) {
      errorCallback && errorCallback(error);
    } else {
      successCallback && successCallback(ret);
    }
  });
}

apiready = function apiready() {
  var userinfo = $api.getStorage('userinfo') || {};
  var userType = userinfo.userType;

  function getStatus(cb) {
    api.showProgress({
      title: '加载中...',
      text: '',
      modal: false
    });
    getAndStorageAuthStatus(function (status) {
      api.hideProgress();
      api.refreshHeaderLoadDone();
      var mapping = {
        // 0未通过，1通过，2人工审核，3人工审核不通过
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
    }, function () {
      api.hideProgress();
      api.refreshHeaderLoadDone();
    });
  }

  function renderStep1(status) {
    if (status === 0) {
      $api.byId('step1').innerHTML = "\n        <div class=\"auth-block\" tapmode=\"active\" id=\"realAuth\">\n          <div class=\"badge\">1</div>\n          <div class=\"text\">\n            <div>\n              <strong>\u5B9E\u540D\u8BA4\u8BC1</strong>\n              <span class=\"icon\"></span>\n            </div>\n            <p>\u8BF7\u51C6\u5907\u60A8\u7684\u4E8C\u4EE3\u8EAB\u4EFD\u8BC1</p>\n          </div>\n          <div class=\"pic idcard\"></div>\n        </div>\n      ";
    } else {
      $api.byId('step1').innerHTML = "\n        <div class=\"auth-block2 authpass\">\n          <div class=\"badge\">1</div>\n          <div class=\"text\">\n            <strong>\u5B9E\u540D\u8BA4\u8BC1</strong>\n          </div>\n          <div class=\"pic\"></div>\n          <span>\u901A\u8FC7</span>\n        </div>\n      ";
    }
  }

  function renderStep2(status) {
    if (status === 0) {
      $api.byId('step2').innerHTML = "\n        <div class=\"auth-block\" tapmode=\"active\" id=\"faceAuth\">\n          <div class=\"badge\">2</div>\n          <div class=\"text\">\n            <div>\n              <strong>\u4EBA\u8138\u8BA4\u8BC1</strong>\n              <span class=\"icon\"></span>\n            </div>\n            <p>\u9700\u8981\u60A8\u672C\u4EBA\u5B8C\u6210\u4EBA\u8138\u8BA4\u8BC1</p>\n          </div>\n          <div class=\"pic facescan\"></div>\n        </div>\n      ";
    } else {
      // autherror
      var type = 'authpass';

      if (status === 2) {
        type = 'authing';
      }

      if (status === 3) {
        type = 'autherror';
      }

      $api.byId('step2').innerHTML = "\n        <div class=\"auth-block2 ".concat(type, "\" id=\"faceAuthResult\">\n          <div class=\"badge\">2</div>\n          <div class=\"text\">\n            <strong>\u4EBA\u8138\u8BA4\u8BC1</strong>\n          </div>\n          <div class=\"pic\"></div>\n          ").concat(status === 1 ? '<span>通过</span>' : status === 3 ? '<span>审核失败<br />请联系客服</span>' : '', "\n        </div>\n      ");
    }
  }

  function renderStep3(status) {
    if (status === 0) {
      $api.byId('step3').innerHTML = "\n        <div class=\"auth-block\" tapmode=\"active\" id=\"baseinfo\">\n          <div class=\"badge\">3</div>\n          <div class=\"text\">\n            <div>\n              <strong>\u8865\u5145\u57FA\u7840\u4FE1\u606F</strong>\n              <span class=\"icon\"></span>\n            </div>\n            <p>\u8BF7\u586B\u5199\u60A8\u4E2A\u4EBA\u7684\u57FA\u7840\u4FE1\u606F</p>\n          </div>\n          <div class=\"pic baseinfo\"></div>\n        </div>\n      ";
    } else {
      $api.byId('step3').innerHTML = "\n        <div class=\"auth-block2 authpass\">\n          <div class=\"badge\">3</div>\n          <div class=\"text\">\n            <strong>\u8865\u5145\u57FA\u7840\u4FE1\u606F</strong>\n          </div>\n          <div class=\"pic\"></div>\n          <span>\u6210\u529F</span>\n        </div>\n      ";
    }
  }

  function bindEvent(mapping) {
    api.parseTapmode();
    var realAuth = document.querySelector('#realAuth');
    var faceAuth = document.querySelector('#faceAuth');
    var baseinfo = document.querySelector('#baseinfo');
    var yuguedu = document.querySelector('#yuguedu');

    if (realAuth) {
      realAuth.onclick = function () {
        openIDcardUpload();
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

        if (mapping.faceAuth.status === 0 || mapping.faceAuth.status === 2 || mapping.faceAuth.status === 3) {
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
  setRefreshHeaderInfo(function (ret, err) {
    initPage();
  });
};
