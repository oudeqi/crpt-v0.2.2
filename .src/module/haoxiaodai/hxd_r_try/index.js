import './index.less'
import Router from './../../../router'
const page = new Vue({
  el: '#app',
  data: {
    status: 3,
    isShowPop: false,
  },
  methods: {
    handleOpenDetailFrame() {
      Router.openPage({key: 'hxd_r_try_detail'})
      // api.openFrame({
      //   name: "hxd_r_try_frm",
      //   url: "widget://html/hxd_r_try/frm.html",
      //   // animation: {
      //   //   type: 'fade',
      //   //   duration: 300
      //   // },
      //   // background: rgba(48, 49, 51, 0.6);
      //   bgColor: 'rgba(48, 49, 51, 0.6);',
      //   rect: {
      //     // x: 0,
      //     // y: 0,
      //     // w: "auto",
      //     // h: "auto"
      //     x: 0,
      //     y: 0,
      //     w: 'auto',
      //     h: 'auto'
      //   },
      //   bounces: true,
      //   opaque: true,
      //   vScrollBarEnabled: false,
      //   scrollEnabled: false,
      //   fixedOn: api.frameName,
      //   fixed: true
      // });
      
    },
    handleOpenPop() {
      this.isShowPop = true
    },
    handleClosePop() {
      this.isShowPop = false
    }
  },
  mounted() { }
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