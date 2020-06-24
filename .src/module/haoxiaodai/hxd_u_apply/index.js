import './index.less'

const page = new Vue({
  el: '#app',
  data: {
    isWarning: true,
    orders: [
      {
        title: "成都阳光农业服务有限公司1",
        can: "120000",
        left: "66000",
        date: "2020-06-12",
        orderId: "77889900022009988",
        isSelected: true
      },
      {
        title: "成都阳光农业服务有限公司2",
        can: "120000",
        left: "66000",
        date: "2020-06-12",
        orderId: "77889900000992288",
        isSelected: true
      },
      {
        title: "成都阳光农业服务有限公司3",
        can: "120000",
        left: "66000",
        date: "2020-06-12",
        orderId: "73378899000009988",
        isSelected: false
      }
    ]
  },
  methods: {

  },
})

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  // alert(Vue)

}