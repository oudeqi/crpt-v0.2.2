import '../../../app.css'
import './win.css'

import { openProductRecommend } from '../../../webview.js'
import { http } from '../../../config.js'
import numeral from 'numeral'

apiready = function() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let userinfo = $api.getStorage('userinfo') || {}
  let { name, userType } = userinfo
  $api.byId('name').innerHTML = name

  function getPageData () {
    http.get('/crpt-credit/credit/creditpre/amount').then(res => {
      const data = res.data || {}
      $api.byId('edu').innerHTML = numeral(data.creditAmount).format('0,0') || '****'
    }).catch(error => {
      api.toast({
        msg: error.msg || '获取数据失败'
      })
    })
  }

  getPageData()

  document.querySelector('#next').onclick = function () {
    openProductRecommend()
  }

}
