import './index.less'
import http from '../../http/index.js'
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
      this.getLocation()
    },
    methods: {
      getData () {
        http.get('/crpt-cust/customer/account/hope/account/info', {}).then(res => {
          this.accountData = res.data
        })
      },
      getLocation () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              latitude = position.coords.latitude; //获取纬度
              longitude = position.coords.longitude; //获取经度
              console.log(latitude)
              console.log(longitude)
            });
        } else {
          alert("不支持定位功能");
        }
      }
    }
  })

}