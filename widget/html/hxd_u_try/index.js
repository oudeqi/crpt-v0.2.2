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

// 主题色
var themeMainColor = 'rgba(102,187,106,1)'; // 导航文字黑色

var textColor = 'rgba(48,49,51,1)'; // 浅色底导航

var navigationBarWhite = {
  hideBackButton: false,
  background: '#fff',
  color: textColor,
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [{
    text: '',
    color: themeMainColor,
    iconPath: 'widget://image/back_green_big.png'
  }]
}; // 绿色底导航

var navigationBarGreen = {
  hideBackButton: false,
  background: themeMainColor,
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [{
    text: '',
    color: '#fff',
    iconPath: 'widget://image/back_white_big.png'
  }]
};

/**
 * themeMainColor 主题色
 * textColor 导航文字黑色
 * navigationBarWhite 浅色底导航
 * navigationBarGreen 绿色底导航
 */

var routerMap = {
  yjd_select_contract: {
    name: 'yjd_select_contract',
    title: '选择代养合同',
    url: 'widget://html/yjd_select_contract/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_apply_confirm: {
    name: 'yjd_apply_confirm',
    title: '申请贷款',
    url: 'widget://html/yjd_apply_confirm/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_hukouben_upload: {
    name: 'yjd_hukouben_upload',
    title: '上传户口本',
    url: 'widget://html/yjd_hukouben_upload/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_apply_status: {
    name: 'yjd_apply_status',
    title: '贷款申请',
    url: 'widget://html/yjd_apply_status/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_apply_result: {
    name: 'yjd_apply_result',
    title: '贷款申请',
    url: 'widget://html/yjd_apply_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_loan_signing: {
    name: 'yjd_loan_signing',
    title: '贷款签约',
    url: 'widget://html/yjd_loan_signing/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_signing_result: {
    name: 'yjd_signing_result',
    title: '签约结果',
    url: 'widget://html/yjd_signing_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_account_open: {
    name: 'yjd_account_open',
    title: '开通新网账户',
    url: 'widget://html/yjd_account_open/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 押金贷产品详情
  yjd_product_detail: {
    name: 'yjd_product_detail',
    title: '产品详情',
    url: 'widget://html/yjd_product_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 贷款申请
  loan_application: {
    name: 'loan_application',
    title: '待申请',
    url: 'widget://html/loan_application/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarGreen
  },
  // 贷款确认
  loan_confirm: {
    name: 'loan_confirm',
    title: '贷款确认',
    url: 'widget://html/loan_confirm/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarGreen
  },
  // 贷款详情
  yjd_loan_details: {
    name: 'yjd_loan_details',
    title: '贷款详情',
    url: 'widget://html/yjd_loan_details/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 还款计划
  repay_plan: {
    name: 'repay_plan',
    title: '还款计划',
    url: 'widget://html/repay_plan/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 还款记录
  repay_record: {
    name: 'repay_record',
    title: '还款记录',
    url: 'widget://html/repay_record/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 代养合同
  yjd_contract: {
    name: 'yjd_contract',
    title: '代养合同',
    url: 'widget://html/yjd_contract/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  }
};

var routerHXDConfig = {
  // 好销贷授信申请
  hxd_apply: {
    name: 'hxd_apply',
    title: '产品介绍',
    url: 'widget://html/hxd_apply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷授信申请补充企业信息
  hxd_a_supply: {
    name: 'hxd_a_supply',
    title: '补充企业信息',
    url: 'widget://html/hxd_a_supply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷授信申请成功/失败
  hxd_a_success: {
    name: 'hxd_a_success',
    title: '产品开通',
    url: 'widget://html/hxd_a_success/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarGreen
  },
  // 好销贷产品详情
  hxd_product_detail: {
    name: 'hxd_product_detail',
    title: '产品详情',
    url: 'widget://html/hxd_product_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷额度变化详情
  hxd_quota: {
    name: 'hxd_quota',
    title: '额度变化详情',
    url: 'widget://html/hxd_quota/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷用款申请
  hxd_u_apply: {
    name: 'hxd_u_apply',
    title: '申请用款',
    url: 'widget://html/hxd_u_apply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷用款确认
  hxd_u_confirm: {
    name: 'hxd_u_confirm',
    title: '用款确认',
    url: 'widget://html/hxd_u_confirm/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷用款确认
  hxd_u_try: {
    name: 'hxd_u_try',
    title: '用款试算',
    url: 'widget://html/hxd_u_try/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷用款校验
  hxd_u_smscode: {
    name: 'hxd_u_smscode',
    title: '用款校验',
    url: 'widget://html/hxd_u_smscode/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷用款结果
  hxd_u_result: {
    name: 'hxd_u_result',
    title: '审核结果',
    url: 'widget://html/hxd_u_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷还款试算
  hxd_r_try: {
    name: 'hxd_r_try',
    title: '还款试算',
    url: 'widget://html/hxd_r_try/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷还款试算详情页
  hxd_r_try_detail: {
    name: 'hxd_r_try_detail',
    title: '还款试算详情',
    url: 'widget://html/hxd_r_try_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷还款校验页
  hxd_r_smscode: {
    name: 'hxd_r_smscode',
    title: '还款校验',
    url: 'widget://html/hxd_r_smscode/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷还款校验页
  hxd_r_result: {
    name: 'hxd_r_result',
    title: '还款结果',
    url: 'widget://html/hxd_r_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷金服开户申请
  hxd_jf_apply: {
    name: 'hxd_jf_apply',
    title: '转账还款通道',
    url: 'widget://html/hxd_jf_apply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷金服开户成功页
  hxd_jf_account: {
    name: 'hxd_jf_account',
    title: '转账还款通道',
    url: 'widget://html/hxd_jf_account/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷金服开户企业补充信息
  hxd_jf_enterprise: {
    name: 'hxd_jf_enterprise',
    title: '开通信息补充',
    url: 'widget://html/hxd_jf_enterprise/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷金服开户结果
  hxd_jf_result: {
    name: 'hxd_jf_result',
    title: '开户结果',
    url: 'widget://html/hxd_jf_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷金服开户状态查看
  hxd_jf_status: {
    name: 'hxd_jf_status',
    title: '转账还款通道',
    url: 'widget://html/hxd_jf_status/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  }
};

var routerConfig = {
  // 消息中心
  msgcenter: {
    name: 'html/msgcenter/win',
    title: '消息中心',
    url: 'widget://html/msgcenter/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 我的账单
  billlist: {
    name: 'html/billlist/win',
    title: '我的账单',
    url: 'widget://html/billlist/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 我的贷款
  myloan: {
    name: 'html/myloan/win',
    title: '我的贷款',
    url: 'widget://html/myloan/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: false,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 我的额度
  myquota: {
    name: 'html/myquota/win',
    title: '我的额度',
    url: 'widget://html/myquota/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 已开通的产品
  myproduct: {
    name: 'html/myproduct/win',
    title: '我开通的产品',
    url: 'widget://html/myproduct/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 联系我们
  contactus: {
    name: 'html/contactus/win',
    title: '联系我们',
    url: 'widget://html/contactus/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 设置
  settings: {
    name: 'html/settings/win',
    title: '设置',
    url: 'widget://html/settings/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 我的钱包详情
  wallet: {
    name: 'wallet',
    title: '希望钱包',
    url: 'widget://html/wallet/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 通用产品列表
  com_product_list: {
    name: 'com_product_list',
    title: '产品列表',
    url: 'widget://html/com_product_list/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 合同页
  agreement: {
    name: 'agreement',
    title: '查看合同',
    url: 'widget://html/agreement/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  }
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var profile = _objectSpread({}, routerHXDConfig, {}, routerMap, {}, routerConfig);

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Router = /*#__PURE__*/function () {
  function Router() {
    classCallCheck(this, Router);
  }

  createClass(Router, [{
    key: "openPage",
    // 打开window级别页面
    value: function openPage(_ref) {
      var key = _ref.key,
          params = _ref.params;
      api.openTabLayout(_objectSpread$1({}, profile[key], {}, params));
    }
  }]);

  return Router;
}();

var Router$1 = new Router();

var page = new Vue({
  el: '#app',
  data: {
    status: 3,
    isShowPop: false
  },
  methods: {
    handleOpenDetailFrame: function handleOpenDetailFrame() {
      Router$1.openPage({
        key: 'hxd_r_try_detail'
      }); // api.openFrame({
      //   name: "hxd_r_try_frm",
      //   url: "widget://html/hxd_r_try/frm.html",
      //   // animation: {
      //   //   type: 'fade',
      //   //   duration: 300
      //   // },
      //   // background: rgba(48, 49, 51, 0.6);
      //   bgColor: 'rgba(48, 49, 51, 0.6);',
      //   rect: {
      //     // x: 0,
      //     // y: 0,
      //     // w: "auto",
      //     // h: "auto"
      //     x: 0,
      //     y: 0,
      //     w: 'auto',
      //     h: 'auto'
      //   },
      //   bounces: true,
      //   opaque: true,
      //   vScrollBarEnabled: false,
      //   scrollEnabled: false,
      //   fixedOn: api.frameName,
      //   fixed: true
      // });
    },
    handleOpenPop: function handleOpenPop() {
      this.isShowPop = true;
    },
    handleClosePop: function handleClosePop() {
      this.isShowPop = false;
    }
  },
  mounted: function mounted() {}
});

apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  }); // alert(Vue)
};
