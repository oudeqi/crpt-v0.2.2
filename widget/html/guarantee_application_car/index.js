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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

/**
 * 1.1 打开房产信息录入页面
 */

function openGuaranteeApplicationHouse() {
  api.openTabLayout({
    title: '房产信息',
    name: 'html/guarantee_application_house/index',
    url: 'widget://html/guarantee_application_house/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1.2 打开车辆信息录入页面
 */

function openGuaranteeApplicationCar() {
  api.openTabLayout({
    title: '车辆信息',
    name: 'html/guarantee_application_car/index',
    url: 'widget://html/guarantee_application_car/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    navigationBar: navigationBarProfile
  });
}
/**
 * 1.3 打开家庭成员信息录入页面
 */

function openGuaranteeApplicationFamily() {
  api.openTabLayout({
    title: '家庭成员信息',
    name: 'html/guarantee_application_family/index',
    url: 'widget://html/guarantee_application_family/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    navigationBar: navigationBarProfile
  });
}

var rmap = /*#__PURE__*/Object.freeze({
  __proto__: null,
  openPageCreditInformation: openPageCreditInformation,
  openGuaranteeApplicationIndex: openGuaranteeApplicationIndex,
  openGuaranteeApplicationHouse: openGuaranteeApplicationHouse,
  openGuaranteeApplicationCar: openGuaranteeApplicationCar,
  openGuaranteeApplicationFamily: openGuaranteeApplicationFamily
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
        quality: 100,
        targetWidth: 1000,
        // targetHeight: 300,
        saveToPhotoAlbum: false
      }, cb);
    }
  }]);

  return File;
}();

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
};

new Utils();

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

/**
 * @authro liyang
 * @desc 担保业务申请表录入页Page 类
 * @class PageController类，需继承Service类
 */

var PageController = /*#__PURE__*/function () {
  function PageController(props) {
    classCallCheck(this, PageController);

    //  所有表单域预置信息
    this.profile = {
      // upload参数
      uploadImgType: {
        0: 'camera',
        1: 'album'
      }
    }; //  统一管理数据model data

    this.data = {};
  } //  执行函数


  createClass(PageController, [{
    key: "main",
    value: function main(props) {
      this._initData();

      this._bindEvents();
    } //  事件绑定入口

  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
    }
  }, {
    key: "_initData",
    value: function _initData() {}
  }]);

  return PageController;
}();

apiready = function apiready() {
  var pageParam = api.pageParam || {};
  api.setStatusBarStyle({
    style: 'dark'
  });
  new PageController().main();
};