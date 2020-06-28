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
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  }); // alert(Vue)
};
