var page = new Vue({
  el: '#app',
  data: {
    count: 60,
    timer: null,
    smscode: "",
    isCounter: false
  },
  methods: {
    handleChange: function handleChange(e) {
      this.smscode = e.target.value.slice(0, 6);
    },
    handleStartTimer: function handleStartTimer() {
      var _this = this;

      if (this.timer) {
        this.timer = null;
      }

      this.isCounter = true;
      this.timer = setInterval(function () {
        if (_this.count >= 1) {
          _this.count = _this.count - 1;
        } else {
          clearInterval(_this.timer);
          _this.isCounter = false;
          _this.count = 60;
          _this.timer = null;
        }
      }, 1000);
    }
  },
  mounted: function mounted() {
    this.handleStartTimer();
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
