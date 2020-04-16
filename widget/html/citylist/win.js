function CityList() {
  var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cb = arguments.length > 1 ? arguments[1] : undefined;

  var UICityList = api.require('UICityList');

  UICityList.open({
    rect: {
      x: pos.x || 0,
      y: pos.y || 0,
      w: pos.w || api.frameWidth,
      h: pos.h || api.frameHeight
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
    placeholder: '输入城市名或首字母查询' // backBtn: {
    //   rect: {
    //     x: 0,      //（可选项）数字类型；按钮左上角的 x 坐标（相对于模块）；默认：2
    //     y: 0,      //（可选项）数字类型；按钮左上角的 y 坐标（相对于模块）；默认：2
    //     w: 36,    //（可选项）数字类型；按钮的宽度；默认：36
    //     h: 36     //（可选项）数字类型；按钮的高度；默认：36
    //   },
    //   title: '关闭',    //（可选项）字符串类型；按钮标题；默认：不显示
    //   titleColor: '#000000',//（可选项）字符串类型；按钮标题颜色；默认：#ff0000
    //   bgColor: '',   //（可选项）字符串类型；按钮背景颜色；默认：透明
    //   // image:''      //（可选项）字符串类型；按钮背景图片；默认：不显示
    // }

  }, function (ret, err) {
    if (ret.eventType === 'back') ; else if (ret.eventType === 'selected') {
      cb(ret.cityInfo); // UICityList.close()
    }
  });
}

apiready = function apiready() {
  var statusBar = $api.byId('statusBar');
  $api.fixStatusBar(statusBar);
  var statusBarPos = $api.offset(statusBar);
  var pageParam = api.pageParam || {};
  var eventName = pageParam.eventName;
  CityList({
    x: 0,
    y: statusBarPos.h + 45
  }, function (selected) {
    api.sendEvent({
      name: eventName,
      extra: selected
    });
    api.closeWin();
  });
};
