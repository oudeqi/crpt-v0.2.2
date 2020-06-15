apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  var pageParam = api.pageParam || {};
  var status = pageParam.status,
      title = pageParam.title,
      message = pageParam.message; // status: success error during

  if (status === 'success') {
    $api.byId('status').innerHTML = "\n      <div class=\"icon yes\"></div>\n      <div class=\"title\">".concat(message || '认证成功', "</div>\n    ");
  } else if (status === 'error') {
    $api.byId('status').innerHTML = "\n      <div class=\"icon no\"></div>\n      <div class=\"title\">".concat(message || '认证失败，请重试', "</div>\n    ");
  } else {
    $api.byId('status').innerHTML = "\n      <div class=\"during\"></div>\n      <div class=\"title\">".concat(message || '人工审核中...', "</div>\n    ");
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
