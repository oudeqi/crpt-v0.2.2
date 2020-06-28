import './frm.less'

const page = new Vue({
  el: '#app',
  data: {
  },
  mounted() {
    
  },
  methods: {
    handleCloseFrame() {
      api.closeFrame()
    }
  }
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