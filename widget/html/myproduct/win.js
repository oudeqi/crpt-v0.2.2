function openProductDetails() {
  api.openTabLayout({
    name: 'html/productdetails/win',
    title: '产品详情',
    url: 'widget://html/productdetails/win.html',
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
}

apiready = function apiready() {
  document.querySelector('#productDetails').onclick = function () {
    openProductDetails();
  }; // document.querySelector('#noticelist').onclick = function () {

};
