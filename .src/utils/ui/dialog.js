export function dialog({
  title,
  callback
}) {
  const dialogBox = api.require('dialogBox');
  dialogBox.alert({
    texts: {
      // title: '确认',
      content: title,
      leftBtnTitle: '取消',
      rightBtnTitle: '确认提交'
    },
    styles: {
      bg: '#fff',
      w: 300,
      corner: 6,
      content: {
        color: '#606266',
        size: 16,
        marginT: 30,
      },
      left: {
        marginB: 7,
        marginL: 20,
        w: 130,
        h: 35,
        corner: 2,
        bg: '#fff',
        size: 16,
        color: '#606266'

      },
      right: {
        marginB: 7,
        marginL: 10,
        w: 130,
        h: 35,
        corner: 2,
        bg: '#fff',
        size: 16,
        color: '#66BB6A'
      }
    }
  }, function (ret) {
    if (ret.eventType == 'left') {
      dialogBox.close({
        dialogName: 'alert'
      });
    } else {
      dialogBox.close({
        dialogName: 'alert'
      });
      setTimeout(() => {
        callback && callback()
      }, 100);
    }
  });
}