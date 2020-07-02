/**
 * File class
 * @author liyang
 * @desc File类
 */
export default class File {
  actionSheet(title, buttons, cb) {
    api.actionSheet({
      title,
      cancelTitle: '取消',
      buttons
    }, function (ret, err) {
      let index = ret.buttonIndex // index 从1开始
      if (index !== buttons.length + 1) {
        cb(index - 1)
      }
    })
  }

  getPicture(sourceType, cb) {
    // library         //图片库
    // camera          //相机
    // album           //相册
    api.getPicture({
      sourceType,
      encodingType: 'png',
      mediaValue: 'pic',
      destinationType: 'file',
      allowEdit: false,
      quality: 20,
      targetWidth: 1000,
      // targetHeight: 300,
      saveToPhotoAlbum: false
    }, cb)
  }
}
