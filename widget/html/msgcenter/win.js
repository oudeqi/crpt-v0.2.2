// api.lockSlidPane();
// api.unlockSlidPane
var navigationBarWhite = {
  hideBackButton: false,
  background: '#fff',
  color: 'rgba(48,49,51,1)',
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [{
    text: '',
    color: 'rgba(102,187,106,1)',
    iconPath: 'widget://image/back_green_big.png'
  }]
};


function openMsgList(title) {
  api.openTabLayout({
    name: 'html/msglist/win',
    title: title || '',
    url: 'widget://html/msglist/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
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
