apiready = function apiready() {
  var pageParam = api.pageParam || {};
  var status = pageParam.status,
      title = pageParam.title,
      message = pageParam.message; // status: success error during

  if (status === 'success') {
    $api.byId('status').innerHTML = "\n      <div class=\"icon yes\"></div>\n      <div class=\"title\">\u8BA4\u8BC1\u6210\u529F</div>\n    ";
  } else if (status === 'error') {
    $api.byId('status').innerHTML = "\n      <div class=\"icon no\"></div>\n      <div class=\"title\">\u8BA4\u8BC1\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5</div>\n    ";
  } else {
    $api.byId('status').innerHTML = "\n      <div class=\"during\"></div>\n      <div class=\"title\">\u4EBA\u5DE5\u5BA1\u6838\u4E2D...</div>\n    ";
  }

  document.querySelector('#ok').onclick = function () {
    var userinfo = $api.getStorage('userinfo');
    var userType = userinfo.userType;
    var name = '';

    if (userType === '1') {
      name = 'html/todoauthgeren/win';
    } else {
      name = 'html/todoauthqiye/win';
    }

    api.closeToWin({
      name: name
    });
  };
};
