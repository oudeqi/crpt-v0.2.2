var page = new Vue({
  el: '#app',
  data: {},
  mounted: function mounted() {},
  methods: {
    handleCloseFrame: function handleCloseFrame() {
      api.closeFrame();
    }
  }
});

apiready = function apiready() {
  api.openFrame({
    name: "hxd_r_try_detail",
    url: "widget://html/hxd_r_try_detail/index.html",
    // animation: {
    //   type: 'fade',
    //   duration: 300
    // },
    bgColor: 'rgba(48, 49, 51, 0.6)',
    rect: {
      x: (1 - 0.88) / 2 * api.winWidth,
      y: (1 - 0.7) / 2 * api.winHeight + 44,
      w: 0.88 * api.winWidth,
      h: 0.7 * api.winHeight
    },
    bounces: false,
    // opaque: true,
    vScrollBarEnabled: false,
    scrollEnabled: false // fixedOn: api.frameName,
    // fixed: true

  });
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  }); // alert(Vue)
};
