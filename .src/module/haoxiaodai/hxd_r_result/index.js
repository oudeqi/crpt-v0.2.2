import './index.less'

const page = new Vue({
  el: '#app',
  data: {
    status: 3
  },
  methods: {}
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