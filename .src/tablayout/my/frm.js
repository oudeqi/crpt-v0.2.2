import '../../app.css'
import './frm.css'
import http from '../../http'
import Router from '../../router'
import menuConfig from './menu.config'
function initVM() {
  userinfo = $api.getStorage('userinfo')
  let userInfo = {
    name: userinfo.name,
    phone: '****',
    userType: userinfo.userType,
    type: userinfo.userType === '1' ? '个人账号' : '企业账号'
  }
  return new Vue({
    el: '#app',
    data: {
      menuArr: menuConfig,
      userInfo,
      msgCount: '',
      productOpenCount: ''
    },
    mounted() {
      // this.handleInitPage()
      this.handleGetInfo()
    },
    methods: {
      handleToPage(item) {
        Router.openPage({ key: item.router })
      },
      async handleGetInfo() {
        try {
          const res = await http.post('/crpt-cust/identification/myinfo')
          if(res.code === 200) {
            this.userInfo = {
              ...this.userInfo,
              phone: res.data.phone
            }
            if(res.data.msgcount &&  res.data.msgcount > 0) {
              this.msgCount = res.data.msgcount
            }
            if(res.data.prodopencount &&  res.data.prodopencount > 0) {
              this.productOpenCount = res.data.prodopencount
            }
          }
        } catch (error) {
          
        }
        
      },

    }
  })
}
apiready = function () {

  const page = initVM()
  api.addEventListener({
    name: 'viewappear'
  }, function (ret, err) {
    // page.handleInitPage()
    page.handleGetInfo()
  })

  api.addEventListener({
    name: 'keyback'
  }, function (ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })

}
