var index = 0;
var navs = document.querySelectorAll('#nav .item');

function changeNavIndex(i) {
  api.setFrameGroupIndex({
    name: 'orderFrameGroup',
    index: i,
    reload: false,
    scroll: true
  });

  for (var _i = 0; _i < navs.length; _i++) {
    if (_i === index) {
      $api.addCls(navs[_i], 'active');
    } else {
      $api.removeCls(navs[_i], 'active');
    }
  }
}

apiready = function apiready() {
  // document.querySelector('#msgdetails').onclick = function () {
  //   openMsgDetails()
  // }
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  var nav = $api.byId('nav');
  var navPos = $api.offset(nav);

  var _loop = function _loop(i) {
    navs[i].onclick = function () {
      changeNavIndex(i);
    };
  };

  for (var i = 0; i < navs.length; i++) {
    _loop(i);
  }

  api.openFrameGroup({
    name: 'orderFrameGroup',
    index: index,
    scrollEnabled: false,
    fixedOn: 'ui_window',
    // preload: 3,
    rect: {
      x: 0,
      y: navPos.h,
      w: 'auto',
      h: 'auto'
    },
    frames: [{
      name: 'html/myloan/frm/0',
      url: 'widget://html/myloan/frm0.html',
      bounces: true,
      reload: true
    }, {
      name: 'html/myloan/frm/1',
      url: 'widget://html/myloan/frm1.html',
      bounces: true,
      reload: true
    }, {
      name: 'html/myloan/frm/2',
      url: 'widget://html/myloan/frm2.html',
      bounces: true,
      reload: true
    }]
  }, function (ret, err) {
    // document.querySelector('#xx').scrollIntoView({
    //   behavior: "instant",
    //   block: "end",
    //   inline: "start"
    // })
    index = ret.index;

    for (var _i2 = 0; _i2 < navs.length; _i2++) {
      if (_i2 === index) {
        $api.addCls(navs[_i2], 'active');
      } else {
        $api.removeCls(navs[_i2], 'active');
      }
    }
  });
};
