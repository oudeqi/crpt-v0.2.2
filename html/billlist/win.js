function openBillDetails() {
  api.openTabLayout({
    name: 'html/billdetails/win',
    title: '账单详情',
    url: 'widget://html/billdetails/win.html',
    bgColor: '#fff',
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
} // 订单列表

apiready = function apiready() {
  document.querySelector('#billdetails').onclick = function () {
    openBillDetails();
  };
};
