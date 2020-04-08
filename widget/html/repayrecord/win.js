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

var baseUrl = 'http://crptdev.liuheco.com';

var ajax = function ajax(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? null : _ref$tag,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 10 : _ref$timeout;

  return new Promise(function (resolve, reject) {
    console.log(baseUrl + url);
    var userinfo = $api.getStorage('userinfo'); // {
    //   "access_token":"6ca22146-008e-4c12-9772-8d72229b731b",
    //   "token_type":"bearer",
    //   "refresh_token":"6509c5e3-b3d5-4725-9f1b-89b5f548d444",
    //   "expires_in":594349,
    //   "scope":"app",
    //   "msg":"6ca22146-008e-4c12-9772-8d72229b731b",
    //   "code":200,
    //   "data":"6ca22146-008e-4c12-9772-8d72229b731b",
    //   "name":"欧威",
    //   "userType":"1",
    //   "makeBy":"nh-cloud",
    //   "userId":"20"
    // }

    var token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    console.log(JSON.stringify(token));
    api.ajax({
      url: baseUrl + url,
      method: method,
      data: data,
      tag: tag,
      timeout: timeout,
      headers: _objectSpread2({
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': token
      }, headers)
    }, function (ret, err) {
      if (ret) {
        console.log(JSON.stringify(ret));
        resolve(ret);
      } else {
        console.log(JSON.stringify(err));
        reject(err);
      }
    });
  });
};

var handleRet = function handleRet(ret) {
  if (ret && ret.code === 200) {
    return ret;
  } else {
    throw new Error(ret.msg);
  }
};

var _upload = function upload(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref2 = arguments.length > 2 ? arguments[2] : undefined,
      _ref2$headers = _ref2.headers,
      headers = _ref2$headers === void 0 ? {} : _ref2$headers,
      _ref2$tag = _ref2.tag,
      tag = _ref2$tag === void 0 ? null : _ref2$tag,
      _ref2$timeout = _ref2.timeout,
      timeout = _ref2$timeout === void 0 ? 30 : _ref2$timeout;

  return new Promise(function (resolve, reject) {
    api.ajax({
      url: baseUrl + url,
      method: 'post',
      data: data,
      tag: tag,
      headers: headers,
      timeout: timeout
    }, function (ret, err) {
      if (ret) {
        console.log(JSON.stringify(ret));
        resolve(ret);
      } else {
        console.log(JSON.stringify(err));
        reject(err);
      }
    });
  });
};

var http = {
  cancel: function cancel(tag) {
    return api.cancelAjax({
      tag: tag
    });
  },
  get: function get(url, data) {
    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref3.headers,
        tag = _ref3.tag,
        timeout = _ref3.timeout;

    return ajax('get', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  },
  post: function post(url, data) {
    var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref4.headers,
        tag = _ref4.tag,
        timeout = _ref4.timeout;

    return ajax('post', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  },
  put: function put(url, data) {
    var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref5.headers,
        tag = _ref5.tag,
        timeout = _ref5.timeout;

    return ajax('put', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  },
  "delete": function _delete(url, data) {
    var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref6.headers,
        tag = _ref6.tag,
        timeout = _ref6.timeout;

    return ajax('delete', url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  },
  upload: function upload(url, data) {
    var _ref7 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        headers = _ref7.headers,
        tag = _ref7.tag,
        timeout = _ref7.timeout;

    return _upload(url, data, {
      headers: headers,
      tag: tag,
      timeout: timeout
    }).then(handleRet);
  }
}; // 统一ios和android的输入框，下标都从0开始

apiready = function apiready() {
  // document.querySelector('#repayplan').onclick = function () {
  //   openMsgDetails()
  // }
  //
  // document.querySelector('#repayplan').onclick = function () {
  //   openMsgDetails()
  // }
  function getPageData(id) {
    http.get("/credit/repay/query/repayrecord?pageSize=10&pageNo=1&orderNo=".concat(id), {// body: {
      //   pageSize: 10,
      //   pageNo: 1,
      //   orderNo: id
      // }
    }).then(function (res) {})["catch"](function (error) {});
  }

  getPageData('9939393');
};
