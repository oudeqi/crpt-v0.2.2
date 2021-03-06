function openTabLayout(index) {
  api.openTabLayout({
    name: 'tabLayout',
    bgColor: '#fff',
    reload: true,
    delay: 300,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: {
      hideBackButton: true,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      shadow: 'transparent',
      fontWeight: 'normal' // leftButtons: [{
      //   // text: '设置',
      //   // color: '#fff',
      //   // fontSize: 16,
      //   iconPath: 'widget://image/avatar.png',
      // }],
      // rightButtons: [{
      //   text: '设置',
      //   color: '#fff',
      //   fontSize: 16,
      //   // iconPath: 'widget://image/settings@2x.png'
      // }]

    },
    tabBar: {
      animated: false,
      scrollEnabled: true,
      selectedColor: '#66BB6A',
      color: '#606266',
      index: index || 0,
      fontSize: 12,
      // preload: 4,
      list: [{
        text: "首页",
        iconPath: "widget://image/tablayout/shouye.png",
        selectedIconPath: "widget://image/tablayout/shouye_active.png"
      }, {
        text: "贷款",
        iconPath: "widget://image/tablayout/loan.png",
        selectedIconPath: "widget://image/tablayout/loan_active.png"
      }, {
        text: "还款",
        iconPath: "widget://image/tablayout/huankuan.png",
        selectedIconPath: "widget://image/tablayout/huankuan_active.png"
      }, {
        text: "我的",
        iconPath: "widget://image/tablayout/wode.png",
        selectedIconPath: "widget://image/tablayout/wode_active.png"
      }],
      frames: [{
        title: "首页",
        //tab切换时对应的标题
        name: "tablayout/index",
        url: "widget://html/index/frm.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }, {
        title: "贷款申请",
        name: "tablayout/loan",
        url: "widget://html/loan/index.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }, {
        title: "还款",
        name: "tablayout/repay",
        url: "widget://html/repay/index.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }, {
        title: "我的",
        name: "tablayout/my",
        url: "widget://html/my/frm.html",
        bounces: true,
        reload: true,
        scrollToTop: true //其他继承自openFrame的参数

      }]
    }
  });
} // 注册

function vmInit() {
  return new Vue({
    el: '#app',
    data: function data() {
      return {
        pageParam: api.pageParam || {},
        currentSeconds: 3
      };
    },
    computed: {
      status: function status() {
        // 申请状态
        return this.pageParam.status || 'success';
      }
    },
    mounted: function mounted() {
      if (this.status === 'success') {
        this.countDown();
      }
    },
    methods: {
      countDown: function countDown() {
        var _this = this;

        var timer = setInterval(function () {
          _this.currentSeconds--;

          if (_this.currentSeconds === 0) {
            clearInterval(timer);
            setTimeout(function () {
              openTabLayout(1);
            }, 1000);
          }
        }, 1000);
      }
    }
  });
}

apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret) {
    if (ret.type === 'left') {
      openTabLayout(1);
      api.closeWin();
    }
  });
  var vm = vmInit();
};
