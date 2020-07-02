var AppDialog = {
  template: "\n    <div class=\"dialog-mask\" @click=\"onMaskClick\">\n      <div class=\"dialog\">\n        <div v-if=\"title\" class=\"dialog-header\">{{title}}</div>\n        <div class=\"dialog-content\">\n          <slot></slot>\n        </div>\n        <div v-if=\"btns && btns.length > 0\" class=\"dialog-footer\" id=\"dialog_footer\">\n          <div v-for=\"(item, index) in btns\" :key=\"index\" :index=\"index\" @click=\"onBtnClick(index)\" class=\"dialog-btn\" tapmode=\"active\" id=\"close\">{{item}}</div> \n        </div>\n      </div>\n    </div>\n  ",
  props: ['title', 'btns'],
  methods: {
    onBtnClick: function onBtnClick(index) {
      this.$emit('btn-click', index);
    },
    onMaskClick: function onMaskClick(e) {
      if (e.target.className.includes('dialog-mask')) {
        this.$emit('update:show', false);
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
      return {};
    },
    mounted: function mounted() {},
    methods: {
      onBtnClick: function onBtnClick(index) {
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
