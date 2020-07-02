apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  var page = new Vue({
    el: '#app',
    data: {},
    methods: {}
  });
};
