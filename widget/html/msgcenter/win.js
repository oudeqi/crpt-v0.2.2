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
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 消息详情

apiready = function apiready() {
  document.querySelector('#activitylist').onclick = function () {
    openMsgList('账户动态');
  };

  document.querySelector('#noticelist').onclick = function () {
    openMsgList('公告新闻');
  };
};
