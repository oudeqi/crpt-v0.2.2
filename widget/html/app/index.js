function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

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
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: navigationBarProfile
  });
}
/**
 * 打开担保业务申请表页面
 */

function openGuaranteeApplicationIndex() {
  api.openTabLayout({
    title: '担保业务申请表',
    name: 'html/guarantee_application_index/index',
    url: 'widget://html/guarantee_application_index/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    useWKWebView: true,
    animation: {
      type: 'none'
    },
    navigationBar: navigationBarProfile
  });
}

var rmap = /*#__PURE__*/Object.freeze({
  __proto__: null,
  openPageCreditInformation: openPageCreditInformation,
  openGuaranteeApplicationIndex: openGuaranteeApplicationIndex
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

/**
 * @authro liyang
 * @desc 表单单选框picker
 * @params params: { data, success }
 */
var setPicker = function setPicker(params) {
  var UIActionSelector = api.require('UIActionSelector');

  UIActionSelector.open({
    // datas: 'widget://res/city.json',
    datas: params.data,
    layout: {
      row: 4,
      col: 1,
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
  }]);

  return UI;
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
};

var Utils$1 = new Utils();

// $api.getStorage()
// $api.rmStorage()
// $api.clearStorage()

apiready = function apiready() {
  // openBaseinfoFill()
  // openCompanyInfo()
  // // $api.clearStorage()
  var userinfo = $api.getStorage('userinfo'); // 认证状态 int
  // 1：正常
  // 2：待实名认证
  // 3：待人脸审核
  // 4：人脸认证失败，待人工审核
  // 5：待补充基本信息
  // 6：人工审核不通过

  Utils$1.Router.openGuaranteeApplicationIndex(); // if (userinfo) {
  //   const authStatus = $api.getStorage('authStatus') || {}
  //   if (authStatus.status === 1) {
  //     openTabLayout()
  //   } else {
  //     const userType = userinfo.userType
  //     if (userType === '1') {
  //       openTodoAuthGeren()
  //     } else {
  //       openTodoAuthQiye()
  //     }
  //   }
  // } else {
  //   openRegLogin()
  // }
  // 云修复完成

  api.addEventListener({
    name: 'smartupdatefinish'
  }, function (ret, err) {
    api.confirm({
      title: '提示',
      msg: '云修复完成，是否需要重启应用？',
      buttons: ['确定', '取消']
    }, function (ret, err) {
      var index = ret.buttonIndex;

      if (index === 1) {
        api.rebootApp();
      }
    });
  }); // 点击启动页面

  api.addEventListener({
    name: 'launchviewclicked'
  }, function (ret, err) {
    api.alert({
      msg: ret.value
    });
  });
};
