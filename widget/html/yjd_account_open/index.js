function vmInit() {
  return new Vue({
    el: '#app',
    data: function data() {
      return {};
    },
    mounted: function mounted() {},
    methods: {
      next: function next() {
        console.log('zxczxczxczx===');
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
  api.parseTapmode();
};
