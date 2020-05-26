var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

var inherits = _inherits;

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized = _assertThisInitialized;

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

var possibleConstructorReturn = _possibleConstructorReturn;

var getPrototypeOf = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

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


function openCityList(_ref5) {
  var eventName = _ref5.eventName;
  api.openTabLayout({
    name: 'html/citylist/win',
    title: '城市选择',
    url: 'widget://html/citylist/win.html',
    bgColor: '#fff',
    pageParam: {
      eventName: eventName
    },
    slidBackEnabled: true,
    animation: {
      type: 'none'
    },
    navigationBar: {
      height: 44,
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 产品推荐

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

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;
});

// 系统顶部导航配置
var navigationBarProfile = {
  background: '#fff',
  color: '#303133',
  fontSize: 18,
  fontWeight: 500
};

/**
 * 打开授信资料录入页面
 */

function openPageCreditInformation() {
  api.openTabLayout({
    title: '授信资料录入',
    name: 'html/credit_information/index',
    url: 'widget://html/credit_information/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1. 打开担保业务申请表页面
 */

function openGuaranteeApplicationIndex(_ref) {
  var pageParam = _ref.pageParam;
  api.openTabLayout({
    title: '担保业务申请表',
    name: 'html/guarantee_application_index/index',
    url: 'widget://html/guarantee_application_index/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
/**
 * 2. 打开反担保人列表页面
 */

/**
 * 3. 文件送达地址列表页面
 */

/**
 * 4. 其他附件上传页面
 */

function openAttachmentInfo(_ref2) {
  var pageParam = _ref2.pageParam;
  api.openTabLayout({
    title: '附件上传',
    name: 'html/attachment_info/index',
    url: 'widget://html/attachment_info/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1.1 打开房产信息录入页面
 */

function openGuaranteeApplicationHouse(_ref3) {
  var pageParam = _ref3.pageParam;
  api.openTabLayout({
    title: '房产信息',
    name: 'html/guarantee_application_house/index',
    url: 'widget://html/guarantee_application_house/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1.2 打开车辆信息录入页面
 */

function openGuaranteeApplicationCar(_ref4) {
  var pageParam = _ref4.pageParam;
  api.openTabLayout({
    title: '车辆信息',
    name: 'html/guarantee_application_car/index',
    url: 'widget://html/guarantee_application_car/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1.3 打开家庭成员信息录入页面
 */

function openGuaranteeApplicationFamily(_ref5) {
  var pageParam = _ref5.pageParam;
  api.openTabLayout({
    title: '家庭成员信息',
    name: 'html/guarantee_application_family/index',
    url: 'widget://html/guarantee_application_family/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    navigationBar: navigationBarProfile
  });
}
function closeCurrentWinAndRefresh(_ref6) {
  var winName = _ref6.winName,
      frameName = _ref6.frameName,
      script = _ref6.script;
  //  关闭当前win并刷新指定页面
  api.execScript({
    name: winName,
    frameName: frameName,
    script: script
  });
  setTimeout(function () {
    api.closeWin();
  }, 300);
}

var rmap = /*#__PURE__*/Object.freeze({
	__proto__: null,
	openPageCreditInformation: openPageCreditInformation,
	openGuaranteeApplicationIndex: openGuaranteeApplicationIndex,
	openAttachmentInfo: openAttachmentInfo,
	openGuaranteeApplicationHouse: openGuaranteeApplicationHouse,
	openGuaranteeApplicationCar: openGuaranteeApplicationCar,
	openGuaranteeApplicationFamily: openGuaranteeApplicationFamily,
	closeCurrentWinAndRefresh: closeCurrentWinAndRefresh
});

/**
 * Router class
 * @author liyang
 * @desc 路由类
 */

var Router = function Router() {
  classCallCheck(this, Router);

  _extends_1(this, rmap);
};

var openPicker = function openPicker(params, options) {
  var UIActionSelector = api.require('UIActionSelector');

  UIActionSelector.open({
    datas: params.data,
    layout: {
      row: options.row,
      col: options.col,
      height: 40,
      size: 18,
      sizeActive: 18,
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
      size: 15,
      w: 90,
      h: 35,
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    ok: {
      text: '确定',
      size: 15,
      w: 90,
      h: 35,
      bg: 'rgba(102,187,106,1)',
      bgActive: '#ccc',
      color: '#fff',
      colorActive: '#fff'
    },
    title: {
      text: '请选择',
      size: 15,
      h: 50,
      bg: '#eee',
      color: '#888'
    },
    fixedOn: api.frameName
  }, function (ret, err) {
    if (ret.eventType === 'ok') {
      params.success && params.success(ret.selectedInfo);
    }
  });
  return UIActionSelector;
};
/**
 * @authro liyang
 * @desc 表单单选框picker
 * @params params: { data, success }
 */


var setPicker = function setPicker(params) {
  return openPicker(params, {
    row: 4,
    col: 1
  });
};
/**
 * @authro liyang
 * @desc 城市选择框picker
 * @params params: { data, success }
 */

var setCityPicker = function setCityPicker(params) {
  return openPicker(params, {
    row: 5,
    col: 3
  });
};

var showLoading = function showLoading() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '正在加载...';
  api.showProgress({
    title: title,
    text: '',
    modal: true
  });
};
var hideLoading = function hideLoading() {
  api.hideProgress();
};

var toast = function toast(msg) {
  api.toast({
    msg: msg,
    location: 'middle'
  });
};

/**
 * UI class
 * @author liyang
 * @desc UI类
 */

var UI = /*#__PURE__*/function () {
  function UI() {
    classCallCheck(this, UI);
  }

  createClass(UI, [{
    key: "setPicker",
    value: function setPicker$1(params) {
      return setPicker(params);
    }
  }, {
    key: "setCityPicker",
    value: function setCityPicker$1(params) {
      return setCityPicker(params);
    }
  }, {
    key: "showLoading",
    value: function showLoading$1(params) {
      return showLoading(params);
    }
  }, {
    key: "hideLoading",
    value: function hideLoading$1(params) {
      return hideLoading();
    }
  }, {
    key: "toast",
    value: function toast$1(params) {
      return toast(params);
    }
  }]);

  return UI;
}();

/**
 * File class
 * @author liyang
 * @desc File类
 */
var File = /*#__PURE__*/function () {
  function File() {
    classCallCheck(this, File);
  }

  createClass(File, [{
    key: "actionSheet",
    value: function actionSheet(title, buttons, cb) {
      api.actionSheet({
        title: title,
        cancelTitle: '取消',
        buttons: buttons
      }, function (ret, err) {
        var index = ret.buttonIndex; // index 从1开始

        if (index !== buttons.length + 1) {
          cb(index - 1);
        }
      });
    }
  }, {
    key: "getPicture",
    value: function getPicture(sourceType, cb) {
      // library         //图片库
      // camera          //相机
      // album           //相册
      api.getPicture({
        sourceType: sourceType,
        encodingType: 'png',
        mediaValue: 'pic',
        destinationType: 'file',
        allowEdit: false,
        quality: 20,
        targetWidth: 1000,
        // targetHeight: 300,
        saveToPhotoAlbum: false
      }, cb);
    }
  }]);

  return File;
}();

var codeMapFilter = function codeMapFilter(list) {
  var codeMap = {};
  list.filter(function (item, i) {
    return !!item.valid;
  }).forEach(function (el, k) {
    codeMap[el.code] = el.name;
  });
  return codeMap;
};

/**
 * Utils class
 * @authro liyang
 * @desc 工具类暴露的顶层api类，注入各class
 */

var Utils = function Utils() {
  classCallCheck(this, Utils);

  this.Router = new Router();
  this.UI = new UI();
  this.File = new File();
  this.DictFilter = codeMapFilter;
};

var Utils$1 = new Utils();

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var dev = 'http://crptdev.liuheco.com';
var baseUrl =  dev ;
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
          // 表单校验未过专属code
          if (ret.code === 202) {
            var _data = ret.data;
            Utils$1.UI.toast(_data[0].msg);
            resolve(ret);
          } else {
            reject(ret);
          }
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

          reject(error);
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

var isPhoneNo = function isPhoneNo(phone) {
  return /^1[3456789]\d{9}$/.test(phone);
};

function ActionSheet(title, buttons, cb) {
  api.actionSheet({
    title: title,
    cancelTitle: '取消',
    buttons: buttons
  }, function (ret, err) {
    var index = ret.buttonIndex; // index 从1开始

    if (index !== buttons.length + 1) {
      cb(index - 1);
    }
  });
}

function CitySelector(cb) {
  var UIActionSelector = api.require('UIActionSelector');

  UIActionSelector.open({
    datas: 'widget://res/city.json',
    layout: {
      row: 5,
      col: 3,
      height: 40,
      size: 14,
      sizeActive: 16,
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
      size: 15,
      w: 90,
      h: 35,
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    ok: {
      text: '确定',
      size: 15,
      w: 90,
      h: 35,
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    title: {
      text: '请选择',
      size: 15,
      h: 50,
      bg: '#eee',
      color: '#888'
    },
    fixedOn: api.frameName
  }, function (ret, err) {
    if (ret.eventType === 'ok') {
      cb(ret.selectedInfo);
    }
  });
}

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
} // let userinfo = {

function _createSuper(Derived) { return function () { var Super = getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Service = /*#__PURE__*/function () {
  function Service() {
    classCallCheck(this, Service);
  }

  createClass(Service, [{
    key: "submit",
    value: function submit(url, data) {
      return http.post(url, {
        body: data
      });
    }
  }]);

  return Service;
}();

var PageController = /*#__PURE__*/function (_Service) {
  inherits(PageController, _Service);

  var _super = _createSuper(PageController);

  function PageController() {
    var _this;

    classCallCheck(this, PageController);

    _this = _super.apply(this, arguments);
    _this.state = {
      userinfo: $api.getStorage('userinfo'),
      custType: ($api.getStorage('userinfo') || {}).custType,
      userType: ($api.getStorage('userinfo') || {}).userType,
      url: '',
      submitStatus: 'notsubmit',
      // notsubmit:未提交,submitting:正在提交
      postData: {
        marriage: '',
        isChildren: '',
        education: '',
        permanentAddress: '',
        workCompany: '',
        // 工作单位
        animalHusbandryYear: '',
        // 从事畜牧<br />行业年限
        addrProvince: '',
        // String 是 法人居住地址（省）
        addrProvinceCode: '',
        // String 是 法人居住地址编号（省）
        addrCity: '',
        // String 是 法人居住地址（市）
        addrCityCode: '',
        // String 是 法人居住地址编号（市）
        addrCounty: '',
        // String 是 法人居住地址（区县）
        addrCountyCode: '',
        // String 是 法人居住地址编号（区县）
        addrDetail: '',
        // String 是 法人居住地址详细
        relationship: '',
        relationName: '',
        relationPhone: '',
        otherName: '',
        otherPhone: ''
      }
    };
    _this.el = {
      userType1: $api.byId('userType1'),
      userType2: $api.byId('userType2'),
      submit: $api.byId('submit')
    };
    return _this;
  } // 初始化计算属性


  createClass(PageController, [{
    key: "initComputedState",
    value: function initComputedState() {
      // 个人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/personinfo/submission
      // 企业法人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/legalinfo/submission
      if (this.state.userType === '1') {
        this.state.url = '/crpt-cust/saas/personinfo/submission';
      } else {
        this.state.url = '/crpt-cust/saas/legalinfo/submission';
      }
    } // 判断客户类型

  }, {
    key: "renderUserType",
    value: function renderUserType() {
      if (this.state.userType === '1') {
        this.el.userType1.innerHTML = '个人';
        this.el.userType2.innerHTML = '个人';
      } else {
        this.el.userType1.innerHTML = '法定代表人';
        this.el.userType2.innerHTML = '法定代表人';
      }
    } // 初始化表单

  }, {
    key: "initForm",
    value: function initForm() {
      var _this2 = this;

      // 婚姻状况 1：已婚   2：未婚 3：离异
      document.querySelector('#marriage').onclick = function () {
        var btns = ['已婚', '未婚', '离异 '];
        ActionSheet('请选择婚姻状况', btns, function (index) {
          $api.dom($api.byId('marriage'), 'input').value = btns[index];
          _this2.state.postData.marriage = String(index + 1);
        });
      }; // 子女状况  0：无子女 1：有子女


      document.querySelector('#isChildren').onclick = function () {
        var btns = ['无子女', '有子女'];
        ActionSheet('请选择子女状况', btns, function (index) {
          $api.dom($api.byId('isChildren'), 'input').value = btns[index];
          _this2.state.postData.isChildren = String(index);
        });
      }; // 教育情况 ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学']


      document.querySelector('#education').onclick = function () {
        var btns = ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学'];
        ActionSheet('请选择教育情况', btns, function (index) {
          $api.dom($api.byId('education'), 'input').value = btns[index];
          _this2.state.postData.education = btns[index];
        });
      }; // 户籍地址


      api.addEventListener({
        name: 'cityListSelected'
      }, function (ret, err) {
        var selected = ret.value;
        console.log(JSON.stringify(selected));
        $api.dom($api.byId('permanentAddress'), 'input').value = selected.city;
        _this2.state.postData.permanentAddress = selected.city;
      });

      document.querySelector('#permanentAddress').onclick = function () {
        openCityList({
          eventName: 'cityListSelected'
        });
      }; // 工作单位 workCompany


      initUIInput($api.byId('workCompany'), {
        placeholder: '请输入',
        keyboardType: 'next',
        maxStringLength: 10
      }, function (value) {
        _this2.state.postData.workCompany = value;
      }); // 行业年限 animalHusbandryYear

      initUIInput($api.byId('animalHusbandryYear'), {
        placeholder: '请输入',
        keyboardType: 'number',
        maxStringLength: 2
      }, function (value) {
        _this2.state.postData.animalHusbandryYear = value;
      }); // 现居住信息

      document.querySelector('#address').onclick = function () {
        CitySelector(function (selected) {
          console.log(JSON.stringify(selected));
          var a = selected[0];
          var b = selected[1];
          var c = selected[2];
          $api.dom($api.byId('address'), 'input').value = "".concat(a.name, "/").concat(b.name, "/").concat(c.name);
          _this2.state.postData.addrProvince = a.name;
          _this2.state.postData.addrProvinceCode = a.id;
          _this2.state.postData.addrCity = b.name;
          _this2.state.postData.addrCityCode = b.id;
          _this2.state.postData.addrCounty = c.name;
          _this2.state.postData.addrCountyCode = c.id;
        });
      }; // 详细地址


      initUIInput($api.byId('addrDetail'), {
        placeholder: '请输入',
        keyboardType: 'next',
        maxStringLength: 30
      }, function (value) {
        _this2.state.postData.addrDetail = value;
      }); // 亲属关系  标记  1-配偶 2-子女 3-父母

      document.querySelector('#relationship').onclick = function () {
        var btns = ['配偶', '子女', '父母'];
        ActionSheet('请选择亲属关系', btns, function (index) {
          $api.dom($api.byId('relationship'), 'input').value = btns[index];
          _this2.state.postData.relationship = String(index + 1);
        });
      }; // 姓名


      initUIInput($api.byId('relationName'), {
        placeholder: '请输入',
        keyboardType: 'next',
        maxStringLength: 10
      }, function (value) {
        _this2.state.postData.relationName = value;
      }); // 手机号

      initUIInput($api.byId('relationPhone'), {
        placeholder: '请输入',
        keyboardType: 'number',
        maxStringLength: 11
      }, function (value) {
        _this2.state.postData.relationPhone = value;
      }); // 姓名

      initUIInput($api.byId('otherName'), {
        placeholder: '请输入',
        keyboardType: 'next',
        maxStringLength: 10
      }, function (value) {
        _this2.state.postData.otherName = value;
      }); // 手机号

      initUIInput($api.byId('otherPhone'), {
        placeholder: '请输入',
        keyboardType: 'number',
        maxStringLength: 11
      }, function (value) {
        _this2.state.postData.otherPhone = value;
      });
    } // 表单验证

  }, {
    key: "formValidation",
    value: function formValidation() {
      var postData = this.state.postData;
      var valid = true;

      if (!postData.marriage) {
        api.toast({
          msg: '请选择婚姻状况'
        });
        valid = false;
        return valid;
      }

      if (!postData.isChildren) {
        api.toast({
          msg: '请选择子女状况'
        });
        valid = false;
        return valid;
      }

      if (!postData.education) {
        api.toast({
          msg: '请选择教育情况'
        });
        valid = false;
        return valid;
      }

      if (!postData.permanentAddress) {
        api.toast({
          msg: '请选择户籍地址'
        });
        valid = false;
        return valid;
      }

      if (!postData.workCompany) {
        api.toast({
          msg: '请输入工作单位'
        });
        valid = false;
        return valid;
      }

      if (!postData.animalHusbandryYear) {
        api.toast({
          msg: '请输入从事畜牧行业年限'
        });
        valid = false;
        return valid;
      }

      if (!postData.addrProvince) {
        api.toast({
          msg: '请选择居住地省市地区'
        });
        valid = false;
        return valid;
      }

      if (!postData.addrDetail) {
        api.toast({
          msg: '请选择居住地详细地址'
        });
        valid = false;
        return valid;
      }

      if (!postData.relationship) {
        api.toast({
          msg: '请选择亲属关系'
        });
        valid = false;
        return valid;
      }

      if (!postData.relationName) {
        api.toast({
          msg: '请输入直属亲属姓名'
        });
        valid = false;
        return valid;
      }

      if (!postData.relationPhone) {
        api.toast({
          msg: '请输入直属亲属手机号'
        });
        valid = false;
        return valid;
      }

      if (!isPhoneNo(postData.relationPhone)) {
        api.toast({
          msg: '直属亲属手机号格式不正确'
        });
        valid = false;
        return valid;
      }

      if (!postData.otherName) {
        api.toast({
          msg: '请输入其他联系人姓名'
        });
        valid = false;
        return valid;
      }

      if (!postData.otherPhone) {
        api.toast({
          msg: '请输入其他联系人手机号'
        });
        valid = false;
        return valid;
      }

      if (!isPhoneNo(postData.otherPhone)) {
        api.toast({
          msg: '其他联系人手机号格式不正确'
        });
        valid = false;
        return valid;
      }

      return valid;
    } // 事件绑定

  }, {
    key: "bindEvent",
    value: function bindEvent() {
      var _this3 = this;

      this.el.submit.onclick = function () {
        if (_this3.state.submitStatus === 'notsubmit') {
          if (!_this3.formValidation()) {
            return;
          }

          _this3.state.submitStatus = 'submitting';
          $api.addCls(_this3.el.submit, 'loading');

          _this3.submit(_this3.state.url, _this3.state.postData).then(function (ret) {
            _this3.state.submitStatus = 'notsubmit';
            $api.removeCls($api.byId('submit'), 'loading');
            openAuthResult('success', '补充基本信息成功', '补充基本信息');
          })["catch"](function (error) {
            api.toast({
              msg: error.msg || '提交失败',
              location: 'middle'
            });
            _this3.state.submitStatus = 'notsubmit';
            $api.removeCls($api.byId('submit'), 'loading');
          });
        }
      };
    }
  }]);

  return PageController;
}(Service);

apiready = function apiready() {
  var controller = new PageController();
  controller.renderUserType();
  controller.initComputedState();
  controller.initForm();
  controller.bindEvent();
};
