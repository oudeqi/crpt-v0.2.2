// api.lockSlidPane();


function openOrderDetails(id, type) {
  api.openTabLayout({
    name: 'html/orderdetails/win',
    title: '订单详情',
    url: 'widget://html/orderdetails/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      id: id,
      type: type
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
} // 我的额度

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

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
      headers: _objectSpread2({}, Authorization, {}, contentType, {}, headers)
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
  var pageSize = 20;
  var pageNo = 1;
  var loading = false;

  function getPageData(cb) {
    if (loading) {
      return;
    }

    loading = true; // 查询状态： 1-未还清 2-已还清 3-已失效

    http.get("/crpt-order/order/payInfo?status=3&pageSize=".concat(pageSize, "&pageNo=").concat(pageNo)).then(function (res) {
      loading = false;
      api.refreshHeaderLoadDone();

      if (res && res.data.list.length > 0) {
        pageNo++;
        cb(res.data.list);
      } else if (pageNo === 1) {
        api.toast({
          msg: '无数据'
        });
      } else {
        api.toast({
          msg: '无更多数据'
        });
      }
    })["catch"](function (error) {
      loading = false;
      api.refreshHeaderLoadDone();
      api.toast({
        msg: '数据加载失败'
      });
    });
  }

  function appendList(data) {
    var mapping = {
      4: 'cancel',
      5: 'cancel',
      6: 'cancel',
      7: 'during',
      8: 'warning',
      9: 'repaied'
    };
    var mapping2 = {
      4: '退货',
      5: '过期失效',
      6: '已撤销',
      7: '还款中',
      8: '逾期',
      9: '已还清'
    };
    data.forEach(function (item) {
      $api.append($api.byId('list'), "\n      <li tapmode data-id=\"".concat(item.orderNo || '', "\">\n        <div class=\"t\">\n          <div class=\"row1\">\n            <span>\u8BA2\u5355\u7F16\u53F7\uFF1A").concat(item.orderNo || '', "</span>\n            <i class=\"aui-iconfont aui-icon-right\"></i>\n          </div>\n          <div class=\"row2\">\n            <span>\u5356\u65B9\uFF1A</span>\n            ").concat(item.saleCustName, "\n          </div>\n          <div class=\"row2\">\n            <span>\u652F\u4ED8\u65F6\u95F4</span>\n            ").concat(item.orderTime, "\n          </div>\n          <div class=\"row3\">\n            <span class=\"label\">\u652F\u4ED8\u4EA7\u54C1</span>\n            <strong class=\"produce\">").concat(item.productName, "</strong>\n            <span class=\"status ").concat(mapping[item.status], "\">").concat(mapping2[item.status] || '', "</span>\n          </div>\n        </div>\n        <div class=\"b\">\n          <div class=\"tit\">\n            <span>\u652F\u4ED8\u91D1\u989D\uFF08\u5143\uFF09</span>\n            <span>").concat(item.payAmount, "</span>\n          </div>\n          <div class=\"msg\">\n            \u8BA2\u5355\u91D1\u989D\uFF1A").concat(item.totalAmount, "\n          </div>\n        </div>\n      </li>\n      "));
    });
  }

  function refresh() {
    pageNo = 1;
    getPageData(function (data) {
      $api.byId('list').innerHTML = '';
      appendList(data);
    });
  }

  function loadmore() {
    getPageData(function (data) {
      appendList(data);
    });
  }

  api.setRefreshHeaderInfo({
    // loadingImg: 'widget://image/refresh.png',
    bgColor: 'rgba(0,0,0,0)',
    textColor: '#bfbfbf',
    textDown: '下拉刷新',
    textUp: '松开刷新',
    textLoading: '加载中...',
    showTime: false
  }, function (ret, err) {
    refresh();
  });
  api.addEventListener({
    name: 'scrolltobottom',
    extra: {
      threshold: 100 //距离底部距离

    }
  }, function (ret, err) {
    loadmore();
  });
  api.refreshHeaderLoading();

  document.querySelector('#list').onclick = function (event) {
    var li = $api.closest(event.target, 'li');

    if (!li) {
      return;
    }

    if (id) {
      openOrderDetails(id);
    } else {
      api.toast({
        msg: 'id 不存在'
      });
    }
  };
};
