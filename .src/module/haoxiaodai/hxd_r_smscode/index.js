import './index.less'

const page = new Vue({
  el: '#app',
  data: {
    count: 60,
    timer: null,
    smscode: "",
    isCounter: false
  },
  methods: {
    handleChange(e) {
      this.smscode = e.target.value.slice(0, 6);
    },
    handleStartTimer() {
      if (this.timer) {
        this.timer = null;
      }
      this.isCounter = true;
      this.timer = setInterval(() => {
        if (this.count >= 1) {
          this.count = this.count - 1;
        } else {
          clearInterval(this.timer);
          this.isCounter = false;
          this.count = 60;
          this.timer = null;
        }
      }, 1000);
    }
  },
  mounted() {
    this.handleStartTimer()
  }
})

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  // alert(Vue)

}