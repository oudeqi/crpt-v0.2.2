apiready = function apiready() {
  // api.setTabLayoutAttr({
  //   hideNavigationBar: true
  // })
  //
  // api.addEventListener({
  //   name:'tabframe'
  // }, function(ret, err){
  //   if (ret.name === 'tablayout/index') {
  //     api.setTabLayoutAttr({
  //       hideNavigationBar: true
  //     })
  //   } else {
  //     api.setTabLayoutAttr({
  //       hideNavigationBar: false
  //     })
  //   }
  // })
  document.querySelector('#body').onclick = function (event) {
    var clickBtn = $api.closest(event.target, '.clickBtn');

    if (clickBtn) {
      api.alert({
        title: '提示',
        msg: '功能开发中...'
      });
    }
  };

  api.addEventListener({
    name: 'keyback'
  }, function (ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    });
  }); // api.addEventListener({
  //   name: 'swiperight'
  // }, function(ret, err){
  //   openLeftPane()
  // })
  // api.addEventListener({
  //   name: 'navitembtn'
  // }, (ret, err) => {
  //   if (ret.type === 'left') {
  //     openLeftPane()
  //   }else {
  //     openSettings()
  //   }
  // })
};
