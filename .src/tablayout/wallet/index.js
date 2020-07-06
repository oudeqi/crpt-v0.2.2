import './index.less'
import { http } from '../../config.js'
import filter from '../../utils/filter'

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
      getData () {
        http.get('/crpt-cust/customer/account/hope/account/info', {}).then(res => {
          this.accountData = res.data
        })
      }
    }
  })

}