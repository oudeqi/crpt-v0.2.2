import './index.less'
import http from '../../http'
import Utils from '../../utils'
import Router from '../../router'
import { openProductDetails, openContactUs } from '../../webview.js'

apiready = function () {
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
      pageSize: 20,
      pageNo: 1,
      loading: false,
      list: []
    },
    methods: {
      handleClickToPage({ type, id }) {
        switch (type) {
          // 1-信用贷款 2-担保贷款 3-上游入库单贷款
          // 好销贷跳往好销贷产品授信简介
          case 3:
            Router.openPage({
              key: 'hxd_apply',
              params: {
                pageParam: {
                  hasApply: true,
                  productId: id
                }
              }
            })
            break;
          // case 2:

          //   break;

          default:
            openProductDetails({
              id,
              open: 1  // 1 已开通， 0未开通
            })
            break;
        }


      },
      async getPageData(cb) {
        try {
          Utils.UI.showLoading('加载中')
          const res = await http.get(`/crpt-cust/product/openinglist/`)
          if (res.code === 200) {
            if (this.pageNo === 1) {
              Utils.UI.toast('加载完成')
            }
            if (res.data.length > 0) {
              // this.pageNo = this.pageNo + 1
              let newList = this.list.concat(res.data)
              this.list = JSON.parse(JSON.stringify(newList))
              // alert(JSON.stringify(this.list))
            } else {
              Utils.UI.toast('没有更多啦')
            }
          }
        } catch (error) {
          if (error.code) {
            Utils.UI.toast(`${error.code}: ${error.msg}`)
          }
        } finally {
          Utils.UI.hideLoading()

        }
        // http.get(`/crpt-cust/product/openinglist/`).then(res => {
        //   loading = false
        //   api.refreshHeaderLoadDone()
        //   if (res && res.data.length > 0) {
        //     pageNo++
        //     cb(res.data)
        //   } else if (pageNo === 1) {
        //     api.toast({ msg: '无数据' })
        //   } else {
        //     api.toast({ msg: '无更多数据' })
        //   }
        // }).catch(error => {
        //   loading = false
        //   api.refreshHeaderLoadDone()
        //   alert(error)
        //   api.toast({ msg: '数据加载失败' })
        // })
      }
    },
    mounted() {
      this.getPageData()
      Utils.UI.setRefreshHeaderInfo({
        success: () => {
          this.list = []
          this.getPageData()

          setTimeout(() => {
            api.refreshHeaderLoadDone()
          }, 0);
          // api.refreshHeaderLoadDone()
          // setTimeout(() => {
          //   window.location.reload()
          // }, 100);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        },
      })
    },
  })

}