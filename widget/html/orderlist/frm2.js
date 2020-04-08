function openOrderDetails() {
  api.openTabLayout({
    name: 'html/orderdetails/win',
    title: '订单详情',
    url: 'widget://html/orderdetails/win.html',
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
} // 我的额度

apiready = function apiready() {
  document.querySelector('#orderdetails').onclick = function () {
    openOrderDetails();
  };

};
