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

// api.lockSlidPane();


function openAuthResult(status, message, title) {
  // status: success error during
  api.openTabLayout({
    name: 'html/authresult/win',
    title: title || '认证结果',
    url: 'widget://html/authresult/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      status: status,
      title: title,
      message: message
    },
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
} // 消息中心


function openCityList(pageParam) {
  api.openTabLayout({
    name: 'html/citylist/win',
    title: '城市选择',
    url: 'widget://html/citylist/win.html',
    bgColor: '#fff',
    pageParam: pageParam,
    slidBackEnabled: true,
    navigationBar: {
      height: 45,
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
      timeout = _ref$timeout === void 0 ? 60 : _ref$timeout;

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

var isPhoneNo = function isPhoneNo(phone) {
  return /^1[3456789]\d{9}$/.test(phone);
}; // let userinfo = {

function ActionSheet(title, buttons, cb) {
  api.actionSheet({
    title: title,
    cancelTitle: '取消',
    buttons: buttons
  }, function (ret, err) {
    var index = ret.buttonIndex; // index 从1开始

    if (index !== buttons.length + 1) {
      cb(index - 1);
    }
  });
}

function CitySelector(cb) {
  var UIActionSelector = api.require('UIActionSelector');

  UIActionSelector.open({
    datas: 'widget://res/city.json',
    layout: {
      row: 5,
      col: 3,
      height: 30,
      size: 12,
      sizeActive: 14,
      rowSpacing: 5,
      colSpacing: 10,
      maskBg: 'rgba(0,0,0,0.2)',
      bg: '#008000',
      color: '#fff',
      colorActive: '#f00',
      colorSelected: '#000'
    },
    animation: true,
    cancel: {
      text: '取消',
      size: 12,
      w: 90,
      h: 35,
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    ok: {
      text: '确定',
      size: 12,
      w: 90,
      h: 35,
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    title: {
      text: '请选择',
      size: 12,
      h: 44,
      bg: '#eee',
      color: '#888'
    },
    fixedOn: api.frameName
  }, function (ret, err) {
    if (ret.eventType === 'ok') {
      cb(ret.selectedInfo);
    }
  });
}

function initUIInput(dom) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments.length > 2 ? arguments[2] : undefined;

  var UIInput = api.require('UIInput');

  var rect = $api.offset(dom);
  var maxRows = options.maxRows,
      maxStringLength = options.maxStringLength,
      inputType = options.inputType,
      placeholder = options.placeholder,
      keyboardType = options.keyboardType,
      alignment = options.alignment,
      isCenterVertical = options.isCenterVertical;
  UIInput.open({
    rect: {
      x: rect.l,
      y: rect.t,
      w: rect.w,
      h: rect.h
    },
    fixed: false,
    autoFocus: false,
    maxRows: maxRows || 1,
    maxStringLength: maxStringLength,
    inputType: inputType,
    placeholder: placeholder,
    keyboardType: keyboardType,
    alignment: alignment,
    isCenterVertical: isCenterVertical,
    fixedOn: api.frameName,
    styles: {
      bgColor: 'rgba(0,0,0,0)',
      size: 16,
      color: '#333',
      placeholder: {
        color: '#aaa'
      }
    }
  }, function (ret) {
    UIInput.value({
      id: ret.id
    }, function (value) {
      if (value) {
        cb && cb(value.msg);
      }
    });
  });
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

apiready = function apiready() {
  var submitStatus = 'notsubmit'; // notsubmit:未提交,submitting:正在提交

  var postData = {
    marriage: '',
    isChildren: '',
    education: '',
    permanentAddress: '',
    address: '',
    addressDetails: '',
    relationship: '',
    relationName: '',
    relationPhone: '',
    otherName: '',
    otherPhone: ''
  };
  var userinfo = $api.getStorage('userinfo') || {};
  var userType = userinfo.userType;
  $api.byId('userType1').innerHTML = userType === '1' ? '个人' : '法定代表人';
  $api.byId('userType2').innerHTML = userType === '1' ? '个人' : '法定代表人'; // 婚姻状况 1：已婚   2：未婚 3：离异

  document.querySelector('#marriage').onclick = function () {
    var btns = ['已婚', '未婚', '离异 '];
    ActionSheet('请选择婚姻状况', btns, function (index) {
      $api.dom($api.byId('marriage'), 'input').value = btns[index];
      postData.marriage = String(index + 1);
    });
  }; // 子女状况  0：无子女 1：有子女


  document.querySelector('#isChildren').onclick = function () {
    var btns = ['无子女', '有子女'];
    ActionSheet('请选择子女状况', btns, function (index) {
      $api.dom($api.byId('isChildren'), 'input').value = btns[index];
      postData.isChildren = String(index);
    });
  }; // 教育情况 ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学']


  document.querySelector('#education').onclick = function () {
    var btns = ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学'];
    ActionSheet('请选择教育情况', btns, function (index) {
      $api.dom($api.byId('education'), 'input').value = btns[index];
      postData.education = btns[index];
    });
  }; // 户籍地址


  function cityListCallback(selected) {
    console.log(JSON.stringify(selected));
    $api.dom($api.byId('permanentAddress'), 'input').value = selected.city;
    postData.permanentAddress = selected.city;
  } // api.removeEventListener({
  //   name: 'online'
  // })


  api.addEventListener({
    name: 'cityListSelected'
  }, function (ret, err) {
    cityListCallback(ret.value);
  });

  document.querySelector('#permanentAddress').onclick = function () {
    openCityList({
      eventName: 'cityListSelected'
    });
  }; // 现居住信息


  document.querySelector('#address').onclick = function () {
    CitySelector(function (selected) {
      var a = selected[0];
      var b = selected[1];
      var c = selected[2];
      $api.dom($api.byId('address'), 'input').value = a.name + b.name + c.name;
      postData.address = a.name + b.name + c.name;
    });
  }; // 详细地址


  initUIInput($api.byId('addressDetails'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 30
  }, function (value) {
    postData.addressDetails = value;
  }); // 亲属关系  标记  1-配偶 2-子女 3-父母  4-其他

  document.querySelector('#relationship').onclick = function () {
    var btns = ['配偶', '子女', '父母', '其他'];
    ActionSheet('请选择亲属关系', btns, function (index) {
      $api.dom($api.byId('relationship'), 'input').value = btns[index];
      postData.relationship = String(index + 1);
    });
  }; // 姓名


  initUIInput($api.byId('relationName'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 10
  }, function (value) {
    postData.relationName = value;
  }); // 手机号

  initUIInput($api.byId('relationPhone'), {
    placeholder: '请输入',
    keyboardType: 'number',
    maxStringLength: 11
  }, function (value) {
    postData.relationPhone = value;
  }); // 姓名

  initUIInput($api.byId('otherName'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 10
  }, function (value) {
    postData.otherName = value;
  }); // 手机号

  initUIInput($api.byId('otherPhone'), {
    placeholder: '请输入',
    keyboardType: 'number',
    maxStringLength: 11
  }, function (value) {
    postData.otherPhone = value;
  });

  document.querySelector('#submit').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!postData.marriage) {
        return api.toast({
          msg: '请选择婚姻状况'
        });
      }

      if (!postData.isChildren) {
        return api.toast({
          msg: '请选择子女状况'
        });
      }

      if (!postData.education) {
        return api.toast({
          msg: '请选择教育情况'
        });
      }

      if (!postData.permanentAddress) {
        return api.toast({
          msg: '请选择户籍地址'
        });
      }

      if (!postData.address) {
        return api.toast({
          msg: '请选择居住地省市地区'
        });
      }

      if (!postData.addressDetails) {
        return api.toast({
          msg: '请选择居住地详细地址'
        });
      }

      if (!postData.relationship) {
        return api.toast({
          msg: '请选择亲属关系'
        });
      }

      if (!postData.relationName) {
        return api.toast({
          msg: '请输入直属亲属姓名'
        });
      }

      if (!postData.relationPhone) {
        return api.toast({
          msg: '请输入直属亲属手机号'
        });
      }

      if (!isPhoneNo(postData.relationPhone)) {
        return api.toast({
          msg: '直属亲属手机号格式不正确'
        });
      }

      if (!postData.otherName) {
        return api.toast({
          msg: '请输入其他联系人姓名'
        });
      }

      if (!postData.otherPhone) {
        return api.toast({
          msg: '请输入其他联系人手机号'
        });
      }

      if (!isPhoneNo(postData.otherPhone)) {
        return api.toast({
          msg: '其他联系人手机号格式不正确'
        });
      }

      submitStatus = 'submitting';
      $api.addCls($api.byId('submit'), 'loading'); // 个人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/personinfo/submission
      // 企业法人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/legalinfo/submission

      var url = '/crpt-cust/saas/legalinfo/submission';

      if (userType === '1') {
        url = '/crpt-cust/saas/personinfo/submission';
      }

      http.post(url, {
        body: _objectSpread$1({}, postData, {
          residentialAddress: postData.address + postData.addressDetails
        })
      }).then(function (ret) {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('submit'), 'loading');
        openAuthResult('success', '补充基本信息成功', '补充基本信息');
      })["catch"](function (error) {
        api.toast({
          msg: error.msg || '提交失败',
          location: 'middle'
        });
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('submit'), 'loading');
      });
    }
  };
};
