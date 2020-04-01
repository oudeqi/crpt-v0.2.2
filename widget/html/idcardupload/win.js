function openIDcardInfo() {
  api.openTabLayout({
    name: 'html/idcardinfo/win',
    title: '确认身份证信息',
    url: 'widget://html/idcardinfo/win.html',
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
} // 人脸认证

apiready = function apiready() {
  document.querySelector('#front').onclick = function () {
    api.getPicture({
      sourceType: 'camera',
      encodingType: 'png',
      mediaValue: 'pic',
      destinationType: 'file',
      allowEdit: true,
      quality: 100,
      targetWidth: 400,
      targetHeight: 300,
      saveToPhotoAlbum: false
    }, function (ret, err) {
      if (ret) {
        $api.dom($api.byId('front'), 'img').src = ret.data;
      }
    });
  };

  document.querySelector('#back').onclick = function () {
    api.getPicture({
      sourceType: 'camera',
      encodingType: 'png',
      mediaValue: 'pic',
      destinationType: 'file',
      allowEdit: true,
      quality: 100,
      targetWidth: 400,
      targetHeight: 300,
      saveToPhotoAlbum: false
    }, function (ret, err) {
      if (ret) {
        $api.dom($api.byId('back'), 'img').src = ret.data;
      }
    });
  };

  document.querySelector('#next').onclick = function () {
    openIDcardInfo();
  };
};
