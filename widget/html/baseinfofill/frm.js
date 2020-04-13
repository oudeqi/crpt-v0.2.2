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

// api.lockSlidPane();


function openAuthResult(status, message, title) {
  // status: success error during
  api.openTabLayout({
    name: 'html/authresult/win',
    title: title || '认证结果',
    url: 'widget://html/authresult/win.html',
    bgColor: '#fff',
    pageParam: {
      status: status,
      title: title,
      message: message
    },
    bounces: true,
    slidBackEnabled: false,
    // pageParam: {
    //   type: type,
    //   title: title,
    //   message: message
    // },
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 消息中心

var uat = 'http://crptuat.liuheco.com';
var baseUrl =   uat ;

var ajax = function ajax(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? null : _ref$tag,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 15 : _ref$timeout;

  return new Promise(function (resolve, reject) {
    var userinfo = $api.getStorage('userinfo');
    var token = userinfo ? userinfo.token_type + ' ' + userinfo.access_token : '';
    var contentType = {
      'Content-Type': 'application/json;charset=utf-8'
    };
    method === 'upload' ? contentType = {} : null;
    api.ajax({
      url: baseUrl + url,
      method: method === 'upload' ? 'post' : method,
      data: data,
      tag: tag,
      timeout: timeout,
      headers: _objectSpread2({
        'Authorization': token
      }, contentType, {}, headers)
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

function openActionSheet(title, buttons, cb) {
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

function openCityList(cb) {
  var UICityList = api.require('UICityList');

  UICityList.open({
    rect: {
      x: 0,
      y: 0,
      w: api.frameWidth,
      h: api.frameHeight
    },
    resource: 'widget://res/UICityList.json',
    topCitys: [{
      'city': '北京',
      //字符串类型；城市
      'id': 110001,
      //字符串类型；城市编号
      'pinyin': 'beijing' //（可选项）字符串类型；本字段可不传，若不传模块内会生成该城市名的pinyin，以防止城市名中的多音字乱序问题

    }],
    styles: {
      searchBar: {
        bgColor: '#696969',
        cancelColor: '#E3E3E3'
      },
      location: {
        color: '#696969',
        size: 12
      },
      sectionTitle: {
        bgColor: '#eee',
        color: '#000',
        size: 12
      },
      item: {
        bgColor: '#fff',
        activeBgColor: '#696969',
        color: '#000',
        size: 14,
        height: 40
      },
      indicator: {
        bgColor: '#fff',
        color: '#696969'
      }
    },
    searchType: 'fuzzy',
    currentCity: '北京',
    locationWay: 'GPS',
    hotTitle: '热门城市',
    fixedOn: api.frameName,
    placeholder: '输入城市名或首字母查询',
    backBtn: {
      rect: {
        x: 0,
        //（可选项）数字类型；按钮左上角的 x 坐标（相对于模块）；默认：2
        y: 0,
        //（可选项）数字类型；按钮左上角的 y 坐标（相对于模块）；默认：2
        w: 36,
        //（可选项）数字类型；按钮的宽度；默认：36
        h: 36 //（可选项）数字类型；按钮的高度；默认：36

      },
      title: '关闭',
      //（可选项）字符串类型；按钮标题；默认：不显示
      titleColor: '#000000',
      //（可选项）字符串类型；按钮标题颜色；默认：#ff0000
      bgColor: '' //（可选项）字符串类型；按钮背景颜色；默认：透明
      // image:''      //（可选项）字符串类型；按钮背景图片；默认：不显示

    }
  }, function (ret, err) {
    if (ret.eventType === 'back') {
      UICityList.close();
    } else if (ret.eventType === 'selected') {
      cb(ret.cityInfo);
      UICityList.close();
    }
  });
}

function openCitySelector(cb) {
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

function openUIInput(dom) {
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

apiready = function apiready() {
  var pageParam = api.pageParam || {};
  var userType = pageParam.userType;
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
  }; // 婚姻状况 1：已婚   2：未婚 3：离异

  document.querySelector('#marriage').onclick = function () {
    var btns = ['已婚', '未婚', '离异 '];
    openActionSheet('请选择婚姻状况', btns, function (index) {
      $api.dom($api.byId('marriage'), 'input').value = btns[index];
      postData.marriage = String(index + 1);
    });
  }; // 子女状况  0：无子女 1：有子女


  document.querySelector('#isChildren').onclick = function () {
    var btns = ['无子女', '有子女'];
    openActionSheet('请选择子女状况', btns, function (index) {
      $api.dom($api.byId('isChildren'), 'input').value = btns[index];
      postData.isChildren = String(index);
    });
  }; // 教育情况 ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学']


  document.querySelector('#education').onclick = function () {
    var btns = ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学'];
    openActionSheet('请选择教育情况', btns, function (index) {
      $api.dom($api.byId('education'), 'input').value = btns[index];
      postData.education = btns[index];
    });
  }; // 户籍地址


  document.querySelector('#permanentAddress').onclick = function () {
    openCityList(function (selected) {
      $api.dom($api.byId('permanentAddress'), 'input').value = selected.city;
      postData.permanentAddress = selected.city;
    });
  }; // 现居住信息


  document.querySelector('#address').onclick = function () {
    openCitySelector(function (selected) {
      var a = selected[0];
      var b = selected[1];
      var c = selected[2];
      $api.dom($api.byId('address'), 'input').value = a.name + b.name + c.name;
      postData.address = a.name + b.name + c.name;
    });
  }; // 详细地址


  openUIInput($api.byId('addressDetails'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.addressDetails = value;
  }); // 亲属关系  标记  1-配偶 2-子女 3-父母  4-其他

  document.querySelector('#relationship').onclick = function () {
    var btns = ['配偶', '子女', '父母', '其他'];
    openActionSheet('请选择亲属关系', btns, function (index) {
      $api.dom($api.byId('relationship'), 'input').value = btns[index];
      postData.relationship = String(index + 1);
    });
  }; // 姓名


  openUIInput($api.byId('relationName'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.relationName = value;
  }); // 手机号

  openUIInput($api.byId('relationPhone'), {
    placeholder: '请输入',
    keyboardType: 'number',
    maxStringLength: 11
  }, function (value) {
    postData.relationPhone = value;
  }); // 姓名

  openUIInput($api.byId('otherName'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.otherName = value;
  }); // 手机号

  openUIInput($api.byId('otherPhone'), {
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

      submitStatus = 'submitting';
      $api.addCls($api.byId('submit'), 'loading'); // 个人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/personinfo/submission
      // 企业法人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/legalinfo/submission

      http.post('/crpt-cust/saas/personinfo/submission', {
        body: _objectSpread2({}, postData, {
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
