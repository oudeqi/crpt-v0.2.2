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
  api.parseTapmode(); // $api.byId('msg').onclick = function () {
  //   openDialog2()
  //   // openDialog({
  //   //   title: '代养合同信息',
  //   //   path: 'widget://html/yjd_apply_result/contract-msg.html?id=12',
  //   //   webViewH: 500
  //   // })
  // }
};
