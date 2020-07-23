export default function getRealLocation(cb) {
  // 查询用户是否授过权
  let resultList = api.hasPermission({
    list: ['location']
  });
  // 从未授权过
  if (!resultList[0].granted) {
    // ios 有两种情况，未授权或拒绝授权，需要先弹出确认框让用户点击允许，再调用系统授权，否则可能出现直接跳往设置页面，ios审核会不通过
    if (api.systemType === 'ios') {
      // ios需要再次弹出模拟的让用户同意的跳往设置定位的模态框
      api.confirm({
        title: '使用App需要获取您的位置信息，是否允许',
        // msg: 'testmsg',
        buttons: ['允许', '不允许']
      }, function (ret, err) {
        var index = ret.buttonIndex;
        if (index === 1) {
          api.requestPermission({
            list: ['location'],
            // code: 1
          }, function (ret, err) {
            // 已授权
            if (ret.list[0].granted) {
              getGPS(cb)
            } else {
            }

          });
        }
      });

    } else {
      // 安卓直接调用询问
      api.requestPermission({
        list: ['location'],
        // code: 1
      }, function (ret, err) {
        // 已授权
        if (ret.list[0].granted) {
          // 调用 baiduMap获取经纬度
          let bmLocation = api.require('bmLocation');
          bmLocation.singleLocation({
            reGeocode: false,
            netWorkState: false
          }, function (ret) {
            let sta = ret.status;
            if (sta) {
              let latitude = ret.location.latitude;
              let longitude = ret.location.longitude;
              cb && cb({
                latitude,
                longitude
              })
            }
          });
        } else {
        }

      });
    }

  } else {
    // 受过权
    getGPS(cb)
  }
}

function getGPS(cb) {
  if (api.systemType === 'ios') {
    // ios 直接获取经纬度信息
    api.getLocation(function (ret, err) {
      if (ret && ret.status) {
        //获取位置信息成功
        let latitude = ret.latitude
        let longitude = ret.longitude
        cb && cb({
          latitude,
          longitude
        })
        // alert(JSON.stringify(ret))
      } else {
        // alert(JSON.stringify(err));
      }
    });
  } else {
    // android调用baiduMap
    let bmLocation = api.require('bmLocation');
    bmLocation.singleLocation({
      reGeocode: false,
      netWorkState: false
    }, function (ret) {
      let sta = ret.status;
      if (sta) {
        let latitude = ret.location.latitude;
        let longitude = ret.location.longitude;
        cb && cb({
          latitude,
          longitude
        })
        // var t = ret.timestamp;
        // var str = '经度：' + lon + '<br>';
        // str += '纬度：' + lat + '<br>';
        // str += '更新时间：' + t + '<br>';
        // api.alert({ msg: str });
      } else {
        // api.alert({ msg: '发生错误' });
      }
    });
  }
}