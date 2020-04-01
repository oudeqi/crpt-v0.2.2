function openFaceUpload() {
  api.openTabLayout({
    name: 'html/faceupload/win',
    title: '手持身份证上传',
    url: 'widget://html/faceupload/win.html',
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
} // 预估额度

apiready = function apiready() {
  document.querySelector('#start').onclick = function () {};

  document.querySelector('#faceupload').onclick = function () {
    openFaceUpload();
  };
};
