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

function openReg() {
  api.openTabLayout({
    name: 'html/register/win',
    url: 'widget://html/register/win.html',
    // name: 'html/baseinfofill/win',
    title: '注册',
    // url: 'widget://html/baseinfofill/win.html',
    bgColor: '#fff',
    // softInputDismissMode: ['tap', 'interactive'],
    reload: true,
    navigationBar: {
      hideBackButton: false,
      background: '#fff',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [{
        text: '',
        color: '#fff',
        iconPath: 'widget://image/back_green_big.png'
      }]
    }
  }); // api.openWin({
  //   name: 'html/register/win',
  //   url: 'widget://html/register/win.html',
  //   bgColor: '#fff',
  //   reload: true,
  // })
} // 注册登录选择


function openGerenLogin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$userType = _ref.userType,
      userType = _ref$userType === void 0 ? 1 : _ref$userType;

  // 2企业 1个人
  api.openTabLayout({
    name: 'html/gerenlogin/win',
    url: 'widget://html/gerenlogin/win.html',
    // name: 'html/baseinfofill/win',
    title: '',
    // url: 'widget://html/baseinfofill/win.html',
    bgColor: '#fff',
    // softInputDismissMode: ['tap', 'interactive'],
    reload: true,
    pageParam: {
      userType: userType
    },
    navigationBar: {
      hideBackButton: false,
      background: '#fff',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [{
        text: '',
        color: '#fff',
        iconPath: 'widget://image/back_green_big.png'
      }]
    }
  }); // api.openWin({
  //   name: 'html/gerenlogin/win',
  //   url: 'widget://html/gerenlogin/win.html',
  //   bgColor: '#fff',
  //   reload: true,
  //   pageParam: {
  //     userType
  //   }
  // })
} // 企业登录


function openQiyeLogin() {
  api.openTabLayout({
    name: 'html/qiyelogin/win',
    url: 'widget://html/qiyelogin/win.html',
    // name: 'html/baseinfofill/win',
    title: '',
    // url: 'widget://html/baseinfofill/win.html',
    bgColor: '#fff',
    // softInputDismissMode: ['tap', 'interactive'],
    reload: true,
    navigationBar: {
      hideBackButton: false,
      background: '#fff',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [{
        text: '',
        color: '#fff',
        iconPath: 'widget://image/back_green_big.png'
      }]
    }
  }); // api.openWin({
  //   name: 'html/qiyelogin/win',
  //   url: 'widget://html/qiyelogin/win.html',
  //   bgColor: '#fff',
  //   reload: true,
  // })
} // 电话号码登录

var PageController = /*#__PURE__*/function () {
  function PageController() {
    classCallCheck(this, PageController);
  }

  createClass(PageController, [{
    key: "bindEvent",
    value: function bindEvent() {
      document.querySelector('#register').onclick = function () {
        openReg();
      };

      document.querySelectorAll('.login').forEach(function (element) {
        element.onclick = function () {
          if (this.dataset.type === 'geren') {
            openGerenLogin();
          } else {
            openQiyeLogin();
          }
        };
      });
    }
  }]);

  return PageController;
}();

apiready = function apiready() {
  var ctrl = new PageController();
  ctrl.bindEvent();
};
