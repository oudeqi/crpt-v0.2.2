import './index.less'
import http from '../../http/index.js'
// import filterDict from '../../utils/dict_filter/filter.js'
import Utils from '../../utils'
import Router from '../../router'
import filter from '../../utils/filter'

apiready = function () {
  const page = new Vue({
    el: '#app',
    data: {
      filter,
      hxdData: [],
      yjdData: [],
      pageParam: api.pageParam || {}
    },
    async mounted() {
      this.handleGetData()
      Utils.UI.setRefreshHeaderInfo({
        success: () => {
          this.handleGetData()
          setTimeout(() => {
            api.refreshHeaderLoadDone()
          }, 0);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        }
      })
      // this.creditStatusObj = await filterDict('creditStatus')
    },
    methods: {
      handleGetData() {
        if (this.pageParam.pageFrom === 'gongyingshang') {
          this.getHxdTable()
        } else {
          this.getYjdTable()
        }
      },
      async getHxdTable() { // 好销宝
        Utils.UI.showLoading('加载中')
        try {
          const res = await http.get('/crpt-credit/credit/hxd/product/list', {})
          this.hxdData = res.data
          Utils.UI.hideLoading()
        } catch (err) {
          if (err.msg) {
            Utils.UI.toast(`${err.code} : ${err.msg}`)
          }
          Utils.UI.hideLoading()
          // console.log(JSON.stringify(err))
        }
      },
      async getYjdTable() { // 押金贷
        Utils.UI.showLoading('加载中')
        try {
          const res = await http.get('/crpt-product/product/cooperation/fostercare/list', {})
          this.yjdData = res.data
          Utils.UI.hideLoading()
        } catch (err) {
          if (err.msg) {
            Utils.UI.toast(`${err.code} : ${err.msg}`)
          }
          Utils.UI.hideLoading()
          // console.log(JSON.stringify(err))
        }
      },
      changeHXD(item) { // 好销宝跳转
        /**
         * 授信状态0 + 个人用户1 ==> hxd_apply  授信申请页（产品详情)
         * 授信状态0 + 企业用户2 ==> hxd_a_supply  补充企业信息页
         * 授信状态1 ，2 ==> hxd_apply  授信申请页（产品详情)
         * companyExtId === -1 企业用户，并且未填写过信息
         */
        const userType = ($api.getStorage('userinfo') || {}).userType
        if (item.creditStatus === 0 && Number(userType) === 2 && Number(item.companyExtId) === -1) {
          Router.openPage({
            key: 'hxd_a_supply', params: {
              pageParam: { productId: item.productId }
            }
          })
        } else if (item.creditStatus === 2) {
          Router.openPage({
            key: 'hxd_product_detail', params: {
              pageParam: { productId: item.productId }
            }
          })
        } else {
          Router.openPage({
            key: 'hxd_apply', params: {
              pageParam: { productId: item.productId }
            }
          })
        }
      },
      changeYJD(item) { // 押金贷跳转
        Router.openPage({
          key: 'yjd_product_detail', params: {
            pageParam: { item: item }
          }
        })
      }
    }
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
