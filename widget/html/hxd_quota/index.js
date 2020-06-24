var page = new Vue({
  el: '#app',
  data: {
    list: [{
      id: 123,
      text: "额度提升",
      total: "100,000.00",
      year: 2020,
      month: 2,
      date: "02-01"
    }, {
      id: 1234,
      text: "额度提升",
      total: "100,000.00",
      month: 1,
      year: 2020,
      date: "01-01"
    }, {
      id: 1223,
      text: "额度提升",
      total: "100,000.00",
      month: 12,
      year: 2019,
      date: "12-01"
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
