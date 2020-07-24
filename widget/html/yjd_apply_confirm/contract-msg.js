var AppDialog = {
  template: "\n    <div class=\"full-mask\">\n      <div class=\"dialog\">\n        <div v-if=\"showClose\" class=\"dialog-close\" @click=\"handleCloseClick()\"></div>\n        <div v-if=\"title\" class=\"dialog-header\">{{title}}</div>\n        <div class=\"dialog-content\">\n          <slot></slot>\n        </div>\n        <div v-if=\"btns && btns.length > 0\" class=\"dialog-footer\">\n          <div v-for=\"(item, index) in btns\" :key=\"index\" :index=\"index\" @click=\"handleBtnClick(index)\" class=\"dialog-btn\" tapmode=\"active\" id=\"close\">{{item}}</div> \n        </div>\n        <div v-if=\"countdown\" class=\"dialog-footer\">\n          <div @click=\"handleCountdownClick()\" :class=\"['dialog-btn', {disabled: seconds>=0}]\" tapmode=\"active\">\n            <span>{{countdown.desc}}</span>\n            <span v-if=\"seconds>=0\">&nbsp;({{seconds}})</span>\n          </div> \n        </div>\n      </div>\n    </div>\n  ",
  props: {
    title: {
      type: String,
      required: false
    },
    btns: {
      type: Array,
      required: false
    },
    countdown: {
      type: Object,
      required: false
    },
    showClose: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      seconds: 0
    };
  },
  mounted: function mounted() {
    var _this = this;

    if (this.countdown) {
      this.seconds = this.countdown.seconds;
      var timer = setInterval(function () {
        _this.seconds--;

        if (_this.seconds < 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  },
  methods: {
    handleBtnClick: function handleBtnClick(index) {
      this.$emit('btn-click', index);
    },
    handleCloseClick: function handleCloseClick() {
      this.$emit('close-click');
    },
    handleMaskClick: function handleMaskClick() {
      this.$emit('mask-click');
    },
    handleCountdownClick: function handleCountdownClick() {
      if (this.seconds <= 0) {
        this.$emit('countdown-callback');
      }
    }
  }
};

function vmInit() {
  return new Vue({
    el: '#app',
    components: {
      'app-dialog': AppDialog
    },
    data: function data() {
      return {
        pageParam: api.pageParam || {} // countdown: {
        //   desc: '同意',
        //   seconds: 8,
        // }

      };
    },
    computed: {
      title: function title() {
        return this.pageParam.title;
      },
      countdown: function countdown() {
        return this.pageParam.countdown || null;
      }
    },
    mounted: function mounted() {
      this.$refs.contract.innerHTML = $api.getStorage('yjd-loan-contract');
    },
    methods: {
      countdownCallback: function countdownCallback() {
        api.sendEvent({
          name: 'contractagreed',
          extra: {}
        });
        api.closeFrame({
          name: 'dialog'
        }); // 事件发送必须在关闭fram的前面
      },
      handleBtnClick: function handleBtnClick(index) {
        api.closeFrame({
          name: 'dialog'
        });
      },
      handleCloseClick: function handleCloseClick() {
        api.closeFrame({
          name: 'dialog'
        });
      }
    }
  });
}

apiready = function apiready() {
  var vm = vmInit();
};
