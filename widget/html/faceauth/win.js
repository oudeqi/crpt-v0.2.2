function openFaceUpload() {
  api.openTabLayout({
    name: 'html/faceupload/win',
    title: '手持身份证上传',
    url: 'widget://html/faceupload/win.html',
    bgColor: '#fff',
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 预估额度

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

// const baseUrl = 'http://crptdev.liuheco.com'
var baseUrl = 'http://crptuat.liuheco.com';

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
  var pageParam = api.pageParam || {};
  var userType = pageParam.userType;

  if (userType === '1') {
    // userType === '1' ? '个人账号' : '企业账号'
    $api.byId('userType').innerHTML = '';
  } else {
    $api.byId('userType').innerHTML = '法定代表人';
  }

  var facePic = '';
  var submitStatus = 'notsubmit'; // notsubmit:未提交,submitting:正在提交

  function getPicture(cb) {
    // library         //图片库
    // camera          //相机
    // album           //相册
    api.getPicture({
      sourceType: 'library',
      encodingType: 'png',
      mediaValue: 'pic',
      destinationType: 'file',
      allowEdit: true,
      quality: 100,
      targetWidth: 400,
      targetHeight: 300,
      saveToPhotoAlbum: false
    }, cb);
  }

  document.querySelector('#face').onclick = function () {
    getPicture(function (ret, err) {
      if (ret) {
        $api.dom($api.byId('face'), 'img').src = ret.data;
        facePic = ret.data;
      }
    });
  };

  document.querySelector('#start').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!facePic) {
        return api.toast({
          msg: '请选择人脸照'
        });
      }

      submitStatus = 'submitting';
      $api.addCls($api.byId('start'), 'loading');
      http.upload('/crpt-cust/saas/faceauth', {
        files: {
          faceImage: facePic
        }
      }).then(function (ret) {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('start'), 'loading'); // openIDcardInfo({
        //   ...ret.data,
        //   front,
        //   back
        // })
      })["catch"](function (error) {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('start'), 'loading');
      });
    }
  };

  document.querySelector('#faceupload').onclick = function () {
    openFaceUpload();
  };
};
