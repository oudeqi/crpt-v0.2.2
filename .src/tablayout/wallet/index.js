import './index.less'
import http from '../../http/index.js'
import filter from '../../utils/filter'
import Utils from '../../utils'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });

  const page = new Vue({
    el: '#app',
    data: {
      accountData: [],
      filter
    },
    mounted () {
      this.getData()
    },
    methods: {
      async getData () {
        Utils.UI.showLoading('加载中')
        try {
          const res = await http.get('/crpt-cust/customer/account/hope/account/info', {})
          this.accountData = res.data
          Utils.UI.hideLoading()
        } catch (err) {
          Utils.UI.hideLoading()
        }
      }
    }
  })

}