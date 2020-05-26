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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

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


function loginSuccessCallback(userinfo) {
  $api.setStorage('userinfo', userinfo); // 用户信息

  getAndStorageAuthStatus(function (status) {
    // 认证状态 int
    // 1：正常
    // 2：待实名认证
    // 3：待人脸审核
    // 4：人脸认证失败，待人工审核
    // 5：待补充基本信息
    // 6：人工审核不通过
    if (status === 1) {
      openTabLayout();
    } else {
      var _ref7 = userinfo || {},
          userType = _ref7.userType;

      if (userType === '1') {
        // 1个人用户登录 2企业用户登录
        openTodoAuthGeren();
      } else if (userType === '2') {
        openTodoAuthQiye();
      }
    }
  });
}

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

function appLogin(options, successCallback, errorCallback) {
  var pwd = '';

  if (options.verification) {
    // 在验证码登录的时候，密码必须设置为手机号码
    pwd = options.username;
  } else {
    pwd = base64_1.encode(options.password || '');
  }

  http.post('/auth/oauth/token', {
    values: _objectSpread({
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
      client_secret: 'secret'
    }, options, {
      password: pwd
    })
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (userinfo) {
    api.toast({
      msg: '登录成功',
      location: 'middle',
      global: true
    });
    successCallback && successCallback(userinfo);
  })["catch"](function (error) {
    api.toast({
      msg: error.msg || '登录失败',
      location: 'middle'
    });
    errorCallback && errorCallback(error);
  });
}

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
    placeholder: '请确认密码',
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

  document.querySelector('#sendcode').onclick = function () {
    if (sendStatus === 'notsend') {
      var tel = form['tel'][1];

      if (!tel) {
        return api.toast({
          msg: '请输入手机号码',
          location: 'middle'
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
        api.toast({
          msg: error.msg || '验证码发送失败',
          location: 'middle'
        });
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
          msg: '请输入企业全称',
          location: 'middle'
        });
      }

      if (!form['tel'][1]) {
        return api.toast({
          msg: '请输入手机号码',
          location: 'middle'
        });
      }

      if (!form['code'][1]) {
        return api.toast({
          msg: '请输入验证码',
          location: 'middle'
        });
      }

      if (!form['pwd'][1]) {
        return api.toast({
          msg: '请输入密码',
          location: 'middle'
        });
      }

      if (form['pwd'][1] !== form['repwd'][1]) {
        return api.toast({
          msg: '两次密码输入不一致',
          location: 'middle'
        });
      }

      if (!$api.byId('checkbox').checked) {
        return api.toast({
          msg: '请仔细阅读，并同意协议',
          location: 'middle'
        });
      }

      submitStatus = 'submitting';
      var body = {
        phone: form['tel'][1],
        password: Base64.encode(form['pwd'][1]),
        confirmPassword: Base64.encode(form['repwd'][1]),
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
        var body = {
          userType: type === 'geren' ? 1 : 2,
          // 1个人用户登录，2企业用户登录
          username: form['tel'][1],
          loginType: 1,
          // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
          // verification: form['code'][1],
          password: form['pwd'][1]
        };
        appLogin(body, function (userinfo) {
          loginSuccessCallback(userinfo);
        });
      })["catch"](function (error) {
        api.toast({
          msg: error.msg || '注册失败',
          location: 'middle'
        });
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('submit'), 'loading');
      });
    }
  };
};
