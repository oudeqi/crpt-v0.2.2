var page = new Vue({
  el: '#app',
  data: {
    list: [{
      total: "1,030.88",
      principle: "1,000.00",
      interest: "30.66",
      orderId: "10032631641"
    }, {
      total: "1,030.88",
      principle: "1,000.00",
      interest: "30.66",
      orderId: "10032631642"
    }, {
      total: "1,030.88",
      principle: "1,000.00",
      interest: "30.66",
      orderId: "10032631643"
    }, {
      total: "1,030.88",
      principle: "1,000.00",
      interest: "30.66",
      orderId: "10032631644"
    }]
  },
  mounted: function mounted() {},
  methods: {
    handleCloseFrame: function handleCloseFrame() {
      api.closeFrame();
    }
  }
});

apiready = function apiready() {
  // api.openFrame({
  //   name: "hxd_r_try_detail_close",
  //   url: "widget://html/hxd_r_try_detail/frm.html",
  //   rect: {
  //     // x: 0,
  //     // y: 0,
  //     // w: "auto",
  //     // h: "auto"
  //     x: (1 - 0.88) / 2 * api.winWidth,
  //     y: (1 - 0.7) / 2 * api.winHeight + 44 + 0.7 * api.winHeight,
  //     w: 0.88 * api.winWidth,
  //     h: 52
  //   },
  //   bounces: false,
  //   opaque: true,
  //   vScrollBarEnabled: false,
  //   scrollEnabled: false,
  //   fixedOn: api.frameName,
  //   fixed: true
  // })
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  }); // alert(Vue)
};
