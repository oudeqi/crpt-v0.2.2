// api.lockSlidPane();


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
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 账单列表

apiready = function apiready() {
  document.querySelector('#msgdetails').onclick = function () {
    openMsgDetails();
  };
};
