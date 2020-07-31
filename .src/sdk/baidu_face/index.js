/**
 * 百度活体识别sdk
 * @by liyang
 */
export default class BaiduFaceSDK {
  constructor() {
    this.appConfig = {
      "groupID": "crpt_face_lib_1",
      "apiKey": "a4GA7rM8by86Zrg0qARistPb",
      "secretKey": "Opk9Ut6szd5YXSew6gjPfnLYFlhpCBqO",
    }
    this.actionList = [
      "eye",//动作 眨眨眼    7个动作 请最少选择一种 不然就是7种按顺序执行
      "mouth",//动作 张张嘴
      "head_up",//动作 缓慢抬头
      "head_down",//动作 缓慢低头
      "head_left",//动作 向左缓慢转头
      "head_right",//动作 向右缓慢转头
      "left_right",//动作 摇摇头
    ]
  }
  // 暴露api
  open({success, fail}) {
    this.license = {
      "licenseID": api.systemType == "ios" ? 'crpt-app-bdverify-face-ios' : 'crpt-app-bdverify-face-android',
      "licenseFileName": api.systemType == "ios" ? 'idl-license.face-ios' : 'idl-license.face-android',
    }
    this._init({success, fail})
  }
  // 从7个动作中，随机选取3个
  _randomAction() {
    let arr = JSON.parse(JSON.stringify(this.actionList))
    let newArr = [];
    for (var i = 0; i < 3; i++) {
      //随机数
      let num = Math.random() * arr.length;
      num = Math.floor(num);
      newArr.push(arr[num]);
      arr.splice(num, 1)
    }
    // alert(JSON.stringify(newArr))
    let actionDict = {}
    this.actionList.forEach((item) => {
      if (newArr.includes(item)) {
        actionDict[item] = true
      } else {
        actionDict[item] = false
      }
    })
    // alert(JSON.stringify(actionDict))
    return actionDict
  }
  // 获取相机存储权限
  _requestPermission() {
    api.requestPermission({
      list: ['camera', 'storage']
    }, function (ret, err) {
    });
  }
  _init({success, fail}) {
    // 调用前需获取用户相机和存储权限
    this._requestPermission()

    let zyBaiduFace = api.require('zyBaiduFace');
    const param = {
      ...this.license,
      ...this.appConfig
    };
    zyBaiduFace.init(param, (ret, err) => {
      // alert(JSON.stringify(ret));
      const actionParams = {
        "isLivenessRandom": false,//是否随机 检测动作  默认false
        ...this._randomAction(),

        "isSound": true,//默认是否有提示音 默认true
        "filePath": "fs://faces/",//（选填）传入自定义路径  将保存到 你的路径下面 支持fs 不支持widget 不传保存到默认路径 请不要填文件名 这是里文件夹路径
        "base64": false,//是否返回base64 传true就返回base64  不传或者false 就是文件路径
        DesignationCamera: "1",//默认摄像头  1前置  0后置   默认1
        degree: 90 //横屏竖屏应用时 切换的角度   0手机头向左   90正     180向右   270倒放     安卓后置时需反过来设置
      };
      zyBaiduFace.faceLive(actionParams, (ret, err) => {
        // ret.result.  bestimage0原始图片可存下来  headup  headleftorright headright mouth headdown headleft eye
        if (ret.status === true) {
          // alert('活体认证通过')
          try {
            //  /storage/emulated/0/UZMap/A6038689491241/faces/bestimage0.jpg
            let src = `${ret.result['bestimage0']}`
            
            setTimeout(() => {
              // api.toast({
              //   msg: '活体识别通过',
              //   duration: 1000,
              //   location: 'middle'
              // })
              success && success(src)
            }, 50);
          } catch (e) {
            // alert(e)
          }
        } else {
          if(ret.status === false) {
            setTimeout(() => {
              api.toast({
                msg: ret.result,
                duration: 1000,
                location: 'middle'
              })
              fail && fail()
            }, 50);
          }
        }
      });
    });
  }
}

// export default new BaiduFaceSDK()