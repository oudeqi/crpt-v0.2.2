apiready = function apiready() {
  var pageParam = api.pageParam || {};
  var id = pageParam.id,
      type = pageParam.type; // '9939393'
  // var header = document.querySelector('#header');
  // $api.fixStatusBar(header);

  api.setStatusBarStyle({
    style: 'dark'
  });
};
