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

/**
 * @authro liyang
 * @desc 担保业务申请表录入页Page 类
 */

var Page = /*#__PURE__*/function () {
  function Page(props) {
    classCallCheck(this, Page);

    //  所有表单域预置信息
    this.profile = {
      //  picker类组件json
      pickers: {
        landType: [{
          "name": "一般耕地",
          "id": "1"
        }, {
          "name": "基本农田",
          "id": "2"
        }, {
          "name": "山地",
          "id": "3"
        }, {
          "name": "林地",
          "id": "4"
        }, {
          "name": "草地",
          "id": "5"
        }],
        farmType: [{
          "name": "鸡",
          "id": "1"
        }, {
          "name": "鸭",
          "id": "2"
        }, {
          "name": "猪",
          "id": "3"
        }]
      },
      //  select类组件json
      selects: {
        envReport: [{
          "name": "无环评",
          "id": "1"
        }, {
          "name": "环评备案",
          "id": "2"
        }, {
          "name": "环评报告",
          "id": "3"
        }],
        livestockType: [{
          "name": "自有",
          "id": "1"
        }, {
          "name": "租赁",
          "id": "2"
        }],
        shedStructure: [{
          "name": "墙体结构",
          "id": "1"
        }, {
          "name": "立柱式",
          "id": "2"
        }]
      }
    }; //  统一管理数据model data

    this.data = {};
    this.main(props);
  } //  执行函数


  createClass(Page, [{
    key: "main",
    value: function main(props) {
      this._initUI();

      this._bindEvents();
    } //  事件绑定入口

  }, {
    key: "_bindEvents",
    value: function _bindEvents() {

      this._bindPickerEvents(); //  绑定所有select选择框


      this._bindSelectEvents();
    }
  }, {
    key: "_initUI",
    value: function _initUI() {} // 初始化所有picker组件

  }, {
    key: "_initPicker",
    value: function _initPicker(name, dom) {
      var self = this;
      Utils$1.UI.setPicker({
        success: function success(selected) {
          var value = selected[0];
          self.data[name] = value.name;
          dom.innerHTML = value.name;
        },
        data: self.profile.pickers[name]
      });
    } // 绑定所有picker组件的事件

  }, {
    key: "_bindPickerEvents",
    value: function _bindPickerEvents() {
      var self = this;
      var pickerKeys = Object.keys(this.profile.pickers);
      pickerKeys.forEach(function (item, i) {
        document.querySelector("#".concat(item)).onclick = function () {
          self._initPicker(item, this);
        };
      });
    } // 初始化所有Select组件

  }, {
    key: "_initSelect",
    value: function _initSelect() {} // 绑定所有select组件事件

  }, {
    key: "_bindSelectEvents",
    value: function _bindSelectEvents() {
      var self = this;
      var selectKeys = Object.keys(this.profile.selects);
      var defaultClassName = 'fc_c_option';
      var activeClassName = 'active';
      selectKeys.forEach(function (item, i) {
        //  由组件级代理
        var parant = document.querySelector("#".concat(item));

        parant.onclick = function (e) {
          var list = parant.querySelectorAll(".".concat(defaultClassName));
          var ev = window.event || e;

          if (ev.target.nodeName === 'SPAN') {
            for (var _i = 0; _i < list.length; _i++) {
              list[_i].className = defaultClassName;
            }

            ev.target.className = "".concat(defaultClassName, " ").concat(activeClassName);
            self.data[item] = ev.target.innerHTML;
          }
        };
      });
    }
  }]);

  return Page;
}();

apiready = function apiready() {
  var pageParam = api.pageParam || {};
  api.setStatusBarStyle({
    style: 'dark'
  });
  new Page().main();
};
