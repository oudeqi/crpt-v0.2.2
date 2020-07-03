import './index.less'
import filter from './../../../utils/filter'
import http from '../../../http/index.js'

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
        let key = ''
        if (this.detailData.openHopeAccountFlag === 1) { // 已开通
          key = 'yjd_select_contract' // 选择代养合同
        } else { // 未开通
          key = 'yjd_account_open' // 开通新网账户
        }
        Router.openPage({ key: key })
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