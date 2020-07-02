var page = new Vue({
  el: '#app',
  data: {
    status: 3,
    agreements: [{
      id: "123",
      title: "《资金管理业务服务协议》"
    }, {
      id: "1234",
      title: "《平台资金管理业务授权委托书》"
    }]
  },
  methods: {}
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
