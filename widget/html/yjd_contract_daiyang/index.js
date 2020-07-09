// payee, // 收款方
// signedDate, // 签订日期
// receivableBond, // 应收保证金
// receivedBond, // 已收保证金
// surplusReceivableBond, // 剩余应收保证金

function vmInit() {
  return new Vue({
    el: '#app',
    data: function data() {
      return {
        pageParam: api.pageParam || {}
      };
    },
    methods: {}
  });
}

apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  vmInit();
};
