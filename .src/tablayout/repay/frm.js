import '../../app.css'

import { openLeftPane } from '../../webview.js'
import { http } from '../../config.js'

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

  function getPageData () {
    http.get('/crpt-credit/credit/repay/pending/list?queryDate=202003').then(res => {

    }).catch(error => {

    })
  }

  // function getDetails (id) {
  //   http.get(`/crpt-order/order/detail/app?orderNo=${id}`).then(res => {
  //
  //   }).catch(error => {
  //
  //   })
  // }

  getPageData()

  // getDetails('9939393')

}
