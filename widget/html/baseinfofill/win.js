apiready = function apiready() {
  var pageParam = api.pageParam || {};
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  var headerPos = $api.offset(header);
  api.openFrame({
    name: 'html/baseinfofill/frm',
    url: 'widget://html/baseinfofill/frm.html',
    bgColor: '#efefef',
    reload: true,
    bounces: true,
    pageParam: pageParam,
    rect: {
      x: 0,
      y: headerPos.h,
      w: 'auto',
      h: 'auto'
    }
  });

  document.querySelector('#back').onclick = function () {
    api.closeWin();
  };
};
