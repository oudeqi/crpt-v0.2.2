function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * 百度活体识别sdk
 * @by liyang
 */
var BaiduFaceSDK = /*#__PURE__*/function () {
  function BaiduFaceSDK() {
    classCallCheck(this, BaiduFaceSDK);

    this.appConfig = {
      "groupID": "crpt_face_lib_1",
      "apiKey": "a4GA7rM8by86Zrg0qARistPb",
      "secretKey": "Opk9Ut6szd5YXSew6gjPfnLYFlhpCBqO"
    };
    this.actionList = ["eye", //动作 眨眨眼    7个动作 请最少选择一种 不然就是7种按顺序执行
    "mouth", //动作 张张嘴
    "head_up", //动作 缓慢抬头
    "head_down", //动作 缓慢低头
    "head_left", //动作 向左缓慢转头
    "head_right", //动作 向右缓慢转头
    "left_right" //动作 摇摇头
    ];
  } // 暴露api


  createClass(BaiduFaceSDK, [{
    key: "open",
    value: function open(_ref) {
      var success = _ref.success,
          fail = _ref.fail;
      this.license = {
        "licenseID": api.systemType == "ios" ? 'crpt-app-bdverify-face-ios' : 'crpt-app-bdverify-face-android',
        "licenseFileName": api.systemType == "ios" ? 'idl-license.face-ios' : 'idl-license.face-android'
      };

      this._init({
        success: success,
        fail: fail
      });
    } // 从7个动作中，随机选取3个

  }, {
    key: "_randomAction",
    value: function _randomAction() {
      var arr = JSON.parse(JSON.stringify(this.actionList));
      var newArr = [];

      for (var i = 0; i < 3; i++) {
        //随机数
        var num = Math.random() * arr.length;
        num = Math.floor(num);
        newArr.push(arr[num]);
        arr.splice(num, 1);
      } // alert(JSON.stringify(newArr))


      var actionDict = {};
      this.actionList.forEach(function (item) {
        if (newArr.includes(item)) {
          actionDict[item] = true;
        } else {
          actionDict[item] = false;
        }
      }); // alert(JSON.stringify(actionDict))

      return actionDict;
    } // 获取相机存储权限

  }, {
    key: "_requestPermission",
    value: function _requestPermission() {
      api.requestPermission({
        list: ['camera', 'storage']
      }, function (ret, err) {});
    }
  }, {
    key: "_init",
    value: function _init(_ref2) {
      var _this = this;

      var success = _ref2.success,
          fail = _ref2.fail;

      // 调用前需获取用户相机和存储权限
      this._requestPermission();

      var zyBaiduFace = api.require('zyBaiduFace');

      var param = _objectSpread({}, this.license, {}, this.appConfig);

      zyBaiduFace.init(param, function (ret, err) {
        // alert(JSON.stringify(ret));
        var actionParams = _objectSpread({
          "isLivenessRandom": false
        }, _this._randomAction(), {
          "isSound": true,
          //默认是否有提示音 默认true
          "filePath": "fs://faces/",
          //（选填）传入自定义路径  将保存到 你的路径下面 支持fs 不支持widget 不传保存到默认路径 请不要填文件名 这是里文件夹路径
          "base64": false,
          //是否返回base64 传true就返回base64  不传或者false 就是文件路径
          DesignationCamera: "1",
          //默认摄像头  1前置  0后置   默认1
          degree: 90 //横屏竖屏应用时 切换的角度   0手机头向左   90正     180向右   270倒放     安卓后置时需反过来设置

        });

        zyBaiduFace.faceLive(actionParams, function (ret, err) {
          // ret.result.  bestimage0原始图片可存下来  headup  headleftorright headright mouth headdown headleft eye
          if (ret.status === true) {
            // alert('活体认证通过')
            try {
              //  /storage/emulated/0/UZMap/A6038689491241/faces/bestimage0.jpg
              var src = "".concat(ret.result['bestimage0']);
              setTimeout(function () {
                // api.toast({
                //   msg: '活体识别通过',
                //   duration: 1000,
                //   location: 'middle'
                // })
                success && success(src);
              }, 50);
            } catch (e) {// alert(e)
            }
          } else {
            if (ret.status === false) {
              setTimeout(function () {
                api.toast({
                  msg: ret.result,
                  duration: 1000,
                  location: 'middle'
                });
                fail && fail();
              }, 50);
            }
          }
        });
      });
    }
  }]);

  return BaiduFaceSDK;
}(); // export default new BaiduFaceSDK()

/**
 * Utils class
 * @authro liyang
 * @desc 工具类暴露的顶层api类，注入各class
 */

var SDK = function SDK() {
  classCallCheck(this, SDK);

  this.BaiduFace = new BaiduFaceSDK();
};

var SDK$1 = new SDK();

apiready = function apiready() {
  var pageParam = api.pageParam || {};
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  var page = new Vue({
    el: '#app',
    data: {},
    methods: {
      handleStart: function handleStart() {
        SDK$1.BaiduFace.open({
          success: function success(src) {
            document.querySelector('#mypic').src = src;
          },
          fail: function fail() {// alert('fail')
          }
        });
        return;
      }
    }
  });
};
