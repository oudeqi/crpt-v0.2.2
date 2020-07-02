Vue.component('list-item', {
  template: "\n    <label>\n      <input type=\"radio\" name=\"contract\" @change=\"onRadioChange\">\n      <div class=\"seclect-content\">\n        <div class=\"seclect-content__top\">\n          <div class=\"seclect-content__toprow\">\n            <span class=\"key\">\u653E\u517B\u5408\u540C\u7F16\u53F7</span>\n            <span class=\"value\">{{data.code}}</span>\n          </div>\n          <div class=\"seclect-content__toprow\">\n            <span class=\"key\">\u6536\u6B3E\u65B9</span>\n            <span class=\"value\">\u6210\u90FD\u9633\u5149\u519C\u4E1A\u670D\u52A1\u6709\u9650\u516C\u53F8</span>\n          </div>\n          <div class=\"seclect-content__toprow\">\n            <span class=\"key\">\u7B7E\u8BA2\u65E5\u671F</span>\n            <span class=\"value\">2019-12-12</span>\n          </div>\n        </div>\n        <div class=\"seclect-content__bott\">\n          <div class=\"seclect-content__bottrow\">\n            <span class=\"key\">\u5E94\u6536\u4FDD\u8BC1\u91D1(\u5143)</span>\n            <span class=\"value\">200,000.00</span>\n          </div>\n          <div class=\"seclect-content__bottrow\">\n            <span class=\"key\">\u5DF2\u6536\u4FDD\u8BC1\u91D1(\u5143)</span>\n            <span class=\"value\">200,000.00</span>\n          </div>\n          <div class=\"seclect-content__bottrow\">\n            <span class=\"key\">\u5269\u4F59\u5E94\u6536\u4FDD\u8BC1\u91D1(\u5143)</span>\n            <span class=\"value seclect-content__value--emphasize\">200,000.00</span>\n          </div>\n        </div>\n      </div>\n    </label>\n  ",
  props: ['data'],
  created: function created() {
    console.log(JSON.stringify(this.data));
  },
  methods: {
    onRadioChange: function onRadioChange() {
      this.$emit('update:selected', this.data);
    }
  }
});

function vmInit() {
  return new Vue({
    el: '#app',
    data: function data() {
      return {
        selected: null,
        list: [{
          code: 'aaaaa'
        }, {
          code: 'bbbbbb'
        }]
      };
    },
    mounted: function mounted() {},
    methods: {
      next: function next() {
        console.log(JSON.stringify(this.selected));
      }
    }
  });
}

apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  var vm = vmInit();
};
