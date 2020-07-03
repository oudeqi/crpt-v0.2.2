import './index.less'



apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  api.closeWin({
    name: 'hxd_u_apply'
  })
  const page = new Vue({
    el: '#app',
    data: {

      status: 1,
      isFolder: true,
      agreements: [
        { id: 1, title: "授信合同1111" },
        { id: 2, title: "授信合同sad" }
      ],
      orders: [
        {
          title: "成都阳光农业服务有限公司",
          can: "120000",
          left: "66000",
          date: "2020-06-12",
          orderId: "77889900022009988"
        },
        {
          title: "成都阳光农业服务有限公司",
          can: "120000",
          left: "66000",
          date: "2020-06-12",
          orderId: "77889900000992288"
        },
        {
          title: "成都阳光农业服务有限公司",
          can: "120000",
          left: "66000",
          date: "2020-06-12",
          orderId: "73378899000009988"
        }
      ]
    },
    methods: {
      handleFolder() {
        this.isFolder = !this.isFolder;
      }
    }
  })

}