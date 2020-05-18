apiready = function apiready() {
  var el = $api.byId('step');
  setTimeout(function () {
    $api.removeCls(el, 'step2');
    $api.addCls(el, 'step3');
  }, 3000);
};
