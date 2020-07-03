import './index.less'
import { http } from '../../../config.js'
import filterDict from '../../../utils/dict_filter/filter.js'
import Utils from '../../../utils'
import Router from '../../../router'

apiready = function () {
  const page = new Vue({
    el: '#app',
    data: {
      hxdData: [],
      yjdData: []
    },
    async mounted () {
      this.getHxdTable()
      // this.creditStatusObj = await filterDict('creditStatus')
      // this.getYjdTable()
    },
    methods: {
      getHxdTable () { // 好销贷
        Utils.UI.showLoading('加载中')
        http.get('/crpt-credit/credit/hxd/product/list', {}).then(res => {
          this.hxdData = res.data
          Utils.UI.hideLoading()
        })
      },
      getYjdTable () { // 押金贷
        http.get('/crpt-product/product/cooperation/fostercare/list', {}).then(res => {
          this.yjdData = res.data
        })
      },
      changePage (item) {
        /**
         * 授信状态0 + 个人用户1 ==> hxd_apply  授信申请页（产品详情)
         * 授信状态0 + 企业用户2 ==> hxd_a_supply  补充企业信息页
         * 授信状态1 ，2 ==> hxd_apply  授信申请页（产品详情)
         */
        const userType = ($api.getStorage('userinfo') || {}).userType
        if (item.creditStatus === 0 && Number(userType) === 2) {
          Router.openPage({ key: 'hxd_a_supply', params: {
            pageParam: {productId: item.productId}
          } })
        } else {
          Router.openPage({ key: 'hxd_apply', params: {
            pageParam: {productId: item.productId}
          }})
        }
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
  // alert(Vue)

}
