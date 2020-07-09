import './index.less'
// import service from './service';
import filter from './../../../utils/filter'
import Utils from '../../../utils';
import Router from '../../../router';



apiready = function () {
  const pageParam = api.pageParam || {}
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
      // count: 60,
      // timer: null,
      // smscode: "",
      // isCounter: false,
      // orderIds: JSON.parse(pageParam.orderIds),
      successList: pageParam.successList,
      failList: pageParam.failList,
      successTotalAmount: filter.toThousands(pageParam.successTotalAmount)
    },
    methods: {
      
    },
    mounted() {
      // this.handleStartTimer()
    }
  })

}