import './index.less'
import filter from './../../../utils/filter'
import http from '../../../http/index.js'
import Router from '../../../router'

apiready = function () {
  const page = new Vue({
    el: '#app',
    data: {
      pageParam: api.pageParam || {},
      filter,
      detailData: {}
    },
    mounted () {
      this.getDetail()
    },
    methods: {
      getDetail () {
        http.get('/crpt-product//product/yjd/detail/' + this.pageParam.item.id, {}).then(res => {
          this.detailData = res.data
        })
      },
      changePage () { // 跳转到开户页面
        Router.openPage({
          key: this.detailData.openHopeAccountFlag === 1 ?
          'yjd_select_contract' : // 选择代养合同
          'yjd_account_open' // 开通新网账户
          , params: {
            pageParam: {productId: this.pageParam.item.id}
          }})
      }
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