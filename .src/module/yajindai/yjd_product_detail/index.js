import './index.less'
import filter from './../../../utils/filter'

apiready = function () {
  const page = new Vue({
    el: '#app',
    data: {
      pageParam: api.pageParam || {},
      filter
    },
    methods: {
    },
  })
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
}