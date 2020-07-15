import './index.less'
import {openTabLayout} from '../../../webview.js'
apiready = function () {
  const page = new Vue({
    el: '#app',
    data: {
      status: 1
    },
    methods: {
      changePage () { // 跳转到还款页面
        openTabLayout(2)
      }
    }
  })
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      openTabLayout(2)
      api.closeWin();
    }
  });
  // alert(Vue)

}