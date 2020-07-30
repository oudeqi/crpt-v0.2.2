

import './index.less'
import SDK from '../../sdk'
apiready = function () {
  const pageParam = api.pageParam || {}
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });

  const page = new Vue({
    el: '#app',
    data: {
    },
    methods: {
      handleStart() {
        SDK.BaiduFace.open({
          success: (src) => {
            document.querySelector('#mypic').src = src
          },
          fail: () => {
            // alert('fail')
          }
        })
        return
        api.requestPermission({
          list: ['camera', 'storage']
        }, function (ret, err) {

          var zyBaiduFace = api.require('zyBaiduFace');
          var param = {
            "licenseID": api.systemType == "ios" ? 'crpt-app-bdverify-face-ios' : 'crpt-app-bdverify-face-android',
            "licenseFileName": api.systemType == "ios" ? 'idl-license.face-ios' : 'idl-license.face-android',
            "groupID": "crpt_face_lib_1",
            "apiKey": "a4GA7rM8by86Zrg0qARistPb",
            "secretKey": "Opk9Ut6szd5YXSew6gjPfnLYFlhpCBqO",
          };
          zyBaiduFace.init(param, function (ret, err) {
            alert(JSON.stringify(ret));
            var param = {
              "isLivenessRandom": true,//是否随机 检测动作  默认false
              "eye": true,//动作 眨眨眼    7个动作 请最少选择一种 不然就是7种按顺序执行
              "mouth": true,//动作 张张嘴
              "head_up": true,//动作 缓慢抬头
              "head_down": false,//动作 缓慢低头
              "head_left": false,//动作 向左缓慢转头
              "head_right": false,//动作 向右缓慢转头
              "left_right": false,//动作 摇摇头

              "isSound": true,//默认是否有提示音 默认true
              "filePath": "fs://faces/",//（选填）传入自定义路径  将保存到 你的路径下面 支持fs 不支持widget 不传保存到默认路径 请不要填文件名 这是里文件夹路径
              "base64": false,//是否返回base64 传true就返回base64  不传或者false 就是文件路径
              DesignationCamera: "1",//默认摄像头  1前置  0后置   默认1
              degree: 90 //横屏竖屏应用时 切换的角度   0手机头向左   90正     180向右   270倒放     安卓后置时需反过来设置
            };
            zyBaiduFace.faceLive(param, function (ret, err) {
              // ret.result.  bestimage0原始图片可存下来  headup  headleftorright headright mouth headdown headleft eye
              if (ret.status === true) {
                alert('活体认证通过')
                try {
                  //  /storage/emulated/0/UZMap/A6038689491241/faces/bestimage0.jpg
                  let src = `${ret.result['bestimage0']}`
                  document.querySelector('#mypic').src = src
                } catch (e) {
                }
              } else {
              }
            });
          });
        });


      }
    }
  })
}