import '../../app.css'
import './frm.css'
import { http } from '../../config.js'
import Router from '../../router'

const page = new Vue({
  el: '#app',
  data: {
    menuArr: [
      {title: '消息中心', 'icon': 'message'},
      {title: '我的账单', 'icon': 'bill'},
      {title: '我的贷款', 'icon': 'orders'},
      {title: '我的额度', 'icon': 'limit'},
      {title: '已开通的产品', 'icon': 'products'},
      {title: '联系我们', 'icon': 'contact'},
      {title: '设置', 'icon': 'settings'},
      {title: '我的钱包', 'icon': 'wallet'}
    ],
    routeKeyArr: [
      'msgcenter', // 消息中心
      'billlist', // 我的账单
      'my_loan', // 我的贷款
      'my_quota', // 我的额度
      'myproduct', // 已开通的产品
      'contactus', // 联系我们
      'settings', // 设置
      'wallet' // 我的钱包
    ]
  },
  mounted () {
  },
  methods: {
    changePage (index) {
      Router.openPage({ key: this.routeKeyArr[index] })
    }
  }
})
apiready = function () {

  let userinfo = {}
  let name = ''
  let userType = ''
  let access_token = ''

  function initPage () {
    userinfo = $api.getStorage('userinfo')
    name = userinfo.name
    userType = userinfo.userType
    access_token = userinfo.access_token
    $api.byId('name').innerHTML = name
    $api.byId('type').innerHTML = userType === '1' ? '个人账号' : '企业账号'
  }
  function getInfo () {
    http.post('/crpt-cust/identification/myinfo').then(res => {
      $api.byId('tel').innerHTML = res.data.phone
      if (res.data.msgcount && res.data.msgcount > 0) {
        $api.byId('msgcount').innerHTML = res.data.msgcount + '条新消息'
      } else {
        $api.byId('msgcount').innerHTML = ''
      }
      if (res.data.prodopencount && res.data.prodopencount > 0) {
        $api.byId('prodopencount').innerHTML = res.data.prodopencount
      } else {
        $api.byId('prodopencount').innerHTML = ''
      }
    }).catch(error => {
      api.toast({
        msg: error.msg || '获取信息失败'
      })
    })
  }
  getInfo()
  initPage()
  api.addEventListener({
    name:'viewappear'
  }, function(ret, err){
    initPage()
    getInfo()
  })

  api.addEventListener({
    name: 'keyback'
  }, function(ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })
}
