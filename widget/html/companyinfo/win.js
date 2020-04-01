function openIDcardUpload() {
  api.openTabLayout({
    name: 'html/idcardupload/win',
    title: '身份证上传',
    url: 'widget://html/idcardupload/win.html',
    bgColor: '#fff',
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 确认身份证信息

apiready = function apiready() {
  api.parseTapmode();

  document.querySelector('#next').onclick = function () {
    openIDcardUpload();
  };
};
