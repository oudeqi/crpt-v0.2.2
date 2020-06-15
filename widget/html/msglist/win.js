function openMsgDetails() {
  api.openTabLayout({
    name: 'html/msgdetails/win',
    title: '消息详情',
    url: 'widget://html/msgdetails/win.html',
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
} // 账单列表

apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });

  document.querySelector('#msgdetails').onclick = function () {
    openMsgDetails();
  };
};
