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

var baseUrl = 'http://crptdev.liuheco.com'; // const baseUrl = 'http://crptuat.liuheco.com'

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
}; // if (ret && ret.statusCode === 500 && ret.body.code === 216) {
//   api.toast({
//     msg: '登录状态已经过期，请重新登录！',
//     duration: 2000,
//     location: 'middle'
//   })
// }


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
    console.log(baseUrl + url);
    var userinfo = $api.getStorage('userinfo');
    var token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    console.log(JSON.stringify(token));
    api.ajax({
      url: baseUrl + url,
      method: 'post',
      data: data,
      tag: tag,
      headers: _objectSpread2({
        'Authorization': token
      }, headers),
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
  var submitStatus = 'notsubmit'; // notsubmit:未提交,submitting:正在提交
  // let idcard = {
  //   "code":200,
  //   "msg":"",
  //   "data":{
  //     "name":"周永刚",
  //     "gender":"男",
  //     "number":"622424199409270411",
  //     "birthday":"1994-09-27",
  //     "address":"甘肃省通渭县平襄镇瓦石村高家庄社45号",
  //     "nation":"汉",
  //     "authority":"通渭县公安局",
  //     "timelimit":"20110125-20210125"
  //   }
  // }

  var pageParam = api.pageParam || {};
  var name = pageParam.name,
      gender = pageParam.gender,
      number = pageParam.number,
      birthday = pageParam.birthday,
      address = pageParam.address,
      nation = pageParam.nation,
      authority = pageParam.authority,
      timelimit = pageParam.timelimit,
      front = pageParam.front,
      back = pageParam.back;
  $api.byId('name').innerHTML = name;
  $api.byId('number').innerHTML = number;
  $api.byId('authority').innerHTML = authority;
  $api.byId('timelimit').innerHTML = timelimit;
  $api.byId('nation').innerHTML = nation;
  $api.byId('address').innerHTML = address;

  document.querySelector('#retry').onclick = function () {
    api.closeWin();
  };

  document.querySelector('#next').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!name || !gender || !number || !birthday || !address || !nation || !authority || !timelimit) {
        return api.toast({
          msg: '未完全识别，请重新上传'
        });
      }

      if (!$api.byId('checkbox').checked) {
        return api.toast({
          msg: '请仔细阅读，并同意协议'
        });
      }

      submitStatus = 'submitting';
      $api.addCls($api.byId('next'), 'loading');
      http.upload('/crpt-cust/saas/realnameauth', {
        values: pageParam,
        files: {
          certImageFront: front,
          certImageBack: back
        }
      }).then(function (ret) {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('next'), 'loading'); // openIDcardInfo(ret.data)
      })["catch"](function (error) {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('next'), 'loading');
      });
    }
  };
};
