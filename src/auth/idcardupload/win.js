
import { openRegLogin, openBaseinfoFill, openTodoAuth,
openIDcardUpload, openIDcardInfo } from '../../webview.js'

apiready = function() {

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
    }, function(ret, err) {
      if (ret) {
        $api.dom($api.byId('front'), 'img').src = ret.data;
      }
    })
  }

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
    }, function(ret, err) {
      if (ret) {
        $api.dom($api.byId('back'), 'img').src = ret.data;
      }
    });
  }

  document.querySelector('#next').onclick = function () {
    openIDcardInfo()
  }

}
