function closeWin() {
  api.closeWin({});
}

apiready = function apiready() {
  api.parseTapmode();
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  var headerPos = $api.offset(header);
  api.openFrame({
    name: 'html/findpwd/frm',
    url: 'widget://html/findpwd/frm.html',
    bounces: true,
    rect: {
      x: 0,
      y: headerPos.h,
      w: 'auto',
      h: 'auto'
    }
  });

  document.querySelector('#back').onclick = function () {
    closeWin();
  };
};
