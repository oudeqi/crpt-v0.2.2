export function setRefreshHeaderInfo ({success, fail, options = {}}) {
  api.setRefreshHeaderInfo({
    // loadingImg: 'widget://image/refresh.png',
    bgColor: 'rgba(0,0,0,0)',
    textColor: '#bfbfbf',
    textDown: '下拉刷新',
    textUp: '松开刷新',
    textLoading: '加载中...',
    showTime: false,
    ...options
  }, function (ret, error) {
    if (error) {
      fail && fail(error)
    } else {
      success && success(ret)
    }
  })
}