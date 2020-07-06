import '../../app.css'
import './index.css'

import { openRepayPlan, openRepayRecord } from '../../webview.js'
import { http, setRefreshHeaderInfo } from '../../config.js'
import numeral from 'numeral'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  document.querySelector('#apply').onclick = function (event) {
    api.alert({
      title: '提示',
      msg: '功能开发中...',
    })
  }
}
