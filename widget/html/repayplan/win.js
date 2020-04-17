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
  var pageSize = 20;
  var pageNo = 1;
  var loading = false;
  var pageParam = api.pageParam || {};
  var id = pageParam.id; // '9939393'
  // 9939393
  // 1101

  function getPageData(cb) {
    if (loading) {
      return;
    }

    loading = true;
    http.get("/crpt-credit/credit/repay/query/repayplan?pageSize=".concat(pageSize, "&pageNo=").concat(pageNo, "&orderNo=").concat(id)).then(function (res) {
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
    data.forEach(function (item) {
      $api.append($api.byId('list'), "\n        <li>\n          <div class=\"l\">\n            <div class=\"txt1\">".concat(item.repayDate ? item.repayDate.split(' ')[0] : '', "</div>\n            <span class=\"txt2\">").concat(item.curPeriod, "\u671F</span><span class=\"txt3\">").concat(item.status === 1 ? '（未按期还）' : '', "</span>\n          </div>\n          <div class=\"r\">\n            <div class=\"txt1\">\u5E94\u8FD8\uFF1A").concat(item.repayTotalAmount, "</div>\n            <div class=\"txt2\">\u672C\u91D1\uFF1A").concat(item.repayPrincipalAmount, "</div>\n            <div class=\"txt2\">\u8D39\u7528\uFF1A").concat(item.serviceFee, "</div>\n            ").concat(item.status === 1 ? "<div class=\"txt3\">\u903E\u671F\u7F5A\u606F\uFF1A".concat(item.repayPenaltyAmount, "</div>") : '', "\n          </div>\n        </li>\n      "));
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
};
