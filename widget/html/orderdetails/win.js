// api.lockSlidPane();


function openRepayPlan(id) {
  api.openTabLayout({
    name: 'html/repayplan/win',
    title: '还款计划',
    url: 'widget://html/repayplan/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      id: id
    },
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
} // 还款明细


function openRepayRecord(id) {
  api.openTabLayout({
    name: 'html/repayrecord/win',
    title: '还款明细',
    url: 'widget://html/repayrecord/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      id: id
    },
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
} // 订单详情

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

// const baseUrl = 'http://crptdev.liuheco.com'
var dev = 'http://crptdev.liuheco.com';
var baseUrl =  dev ;
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
  var pageParam = api.pageParam || {};
  var id = pageParam.id,
      type = pageParam.type; // '9939393'

  if (type !== 'daiZhiFu') {
    $api.byId('payDetails').style.display = 'block';
    $api.byId('repayDetails').style.display = 'block';
    $api.byId('repayDetails').style.display = 'plan';
  }

  document.querySelector('#repayplan').onclick = function () {
    openRepayPlan(id);
  };

  document.querySelector('#repayrecord').onclick = function () {
    openRepayRecord(id);
  };

  document.querySelector('#agreement').onclick = function () {
    api.alert({
      title: '消息',
      msg: '功能开发中...'
    });
  };

  function getDetails(id) {
    http.get("/crpt-order/order/detail/app?orderNo=".concat(id)).then(function (res) {
      // orderNo	String	产融APP订单编号
      // payAmount	BigDecimal	支付金额
      // saleCustName	String	购买来源
      // orderTime	Date	创建时间
      // appCode	String	订单来源
      // totalAmount	BigDecimal	订单金额
      // productName	String	(借贷的)产品名称
      // status int 订单状态：1-未支付 2-支付成功3-支付失败4-退货5-过期失效6-已撤销 7-还款中 8-逾期 9-已还清
      var data = res.data || {};
      $api.byId('orderNo').innerHTML = data.orderNo || '';
      $api.byId('payAmount').innerHTML = data.payAmount || '';
      $api.byId('saleCustName').innerHTML = data.saleCustName || '';
      $api.byId('orderTime').innerHTML = data.orderTime || '';
      $api.byId('appCode').innerHTML = data.appCode || '';
      $api.byId('totalAmount').innerHTML = data.totalAmount || '';
      $api.byId('productName').innerHTML = data.productName || '';
      var mapping = {
        1: '未支付',
        2: '支付成功',
        3: '支付失败',
        4: '退货',
        5: '过期失效',
        6: '已撤销',
        7: '还款中',
        8: '逾期',
        9: '已还清'
      };
      $api.byId('status').innerHTML = mapping[data.status] || '';
    })["catch"](function (error) {
      api.toast({
        msg: error.msg || '网络错误'
      });
    });
  }

  getDetails(id);
};
