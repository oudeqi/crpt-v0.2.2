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

  function getPageData () {
    // 订单状态：1-未支付 2-支付成功3-支付失败4-退货5-过期失效6-已撤销
    http.get('/crpt-order/order/list/currentuser?pageSize=10&pageNo=1&status=1').then(res => {

    }).catch(error => {

    })
  }

  function getDetails (id) {
    http.get(`/crpt-order/order/detail/app?orderNo=${id}`).then(res => {

    }).catch(error => {

    })
  }

  // getPageData()

  // getDetails('9939393')

}
