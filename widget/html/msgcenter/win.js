function openMsgList(title) {
  api.openTabLayout({
    name: 'html/msglist/win',
    title: title || '',
    url: 'widget://html/msglist/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [{
        text: '',
        color: '#fff',
        iconPath: 'widget://image/back_white_big.png'
      }]
    }
  });
} // 消息详情

apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });

  document.querySelector('#activitylist').onclick = function () {
    openMsgList('账户动态');
  };

  document.querySelector('#noticelist').onclick = function () {
    openMsgList('公告新闻');
  };
};
