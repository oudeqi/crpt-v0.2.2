import '../../app.css'

import { openLeftPane } from '../../webview.js'
apiready = function () {

  api.addEventListener({
    name: 'swiperight'
  }, function(ret, err){
    openLeftPane()
  });

  // api.addEventListener({
  //   name: 'navitembtn'
  // }, (ret, err) => {
  //   if (ret.index === 0) {
  //     openLeftPane()
  //   } else {
  //     alert('点错按钮了')
  //   }
  // })

  api.setRefreshHeaderInfo({
    // loadingImg: 'widget://image/refresh.png',
    bgColor: 'rgba(0,0,0,0)',
    textColor: '#bfbfbf',
    textDown: '下拉刷新',
    textUp: '松开刷新',
    textLoading: '加载中...',
    showTime: false
  }, function(ret, err) {
    setTimeout(() => {
      api.refreshHeaderLoadDone();
    }, 1000)
  });
  api.refreshHeaderLoading();
  api.addEventListener({
    name: 'scrolltobottom',
    extra: {
      threshold: 50 //距离底部距离
    }
  }, function(ret, err) {

  })

}
