
// api.lockSlidPane();
// api.unlockSlidPane

// 打开侧滑
function openLeftPane () {
  api.openWin({
    name: 'html/leftpane/win',
    url: 'widget://html/leftpane/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: false,
    slidBackEnabled: false,
    animation: {
      type: 'push',
      subType: 'from_left',
    }
  })
}

// 抽布局
function openDrawerLayout () {
  api.openDrawerLayout({
    name: 'drawerLayout',
    url: 'widget://html/layout/win.html',
    reload: true,
    leftPane: {
      name: 'html/leftpane/win',
      url: 'widget://html/leftpane/win.html',
      bgColor: '#fff',
      bounces: true,
      // edge: 0,
    },
    slidBackEnabled: false,
    slidBackType: 'edge',
  })
}

// 侧滑布局
function openSlidLayout (fn) {
  api.openSlidLayout({
    type: 'left',
    slidPaneStyle: {
      leftEdge: 0
    },
    fixedPaneStyle: {
      leftEdge: api.winWidth
    },
    fixedPane: {
      name: 'html/leftpane/win',
      url: 'widget://html/leftpane/win.html',
      bounces: true,
      scrollToTop: true,
    },
    slidPane: {
      name: 'html/layout/win',
      url: 'widget://html/layout/win.html',
      bounces: true,
      scrollToTop: true,
      bgColor: '#fff',
    }
  }, fn)
}

/*
list: [{
  text: '首页',
  iconPath: 'widget://image/tabLayout/index.png',
  selectedIconPath: 'widget://image/tabLayout/index_active.png'
}, {
  text: '订单',
  iconPath: 'widget://image/tabLayout/order.png',
  selectedIconPath: 'widget://image/tabLayout/order_active.png'
}, {
  text: '还款',
  iconPath: 'widget://image/tabLayout/repay.png',
  selectedIconPath: 'widget://image/tabLayout/repay_active.png'
}, {
  text: '我的',
  iconPath: 'widget://image/tabLayout/mine.png',
  selectedIconPath: 'widget://image/tabLayout/mine_active.png'
}],
*/

// 导航布局
function openTabLayout (index) {
  api.openTabLayout({
    name: 'tabLayout',
    bgColor:'#fff',
    reload: true,
    delay: 300,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: {
      hideBackButton: true,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [{
        // text: '设置',
        // color: '#fff',
        // fontSize: 16,
        iconPath: 'widget://image/avatar.png',
      }],
      // rightButtons: [{
      //   text: '设置',
      //   color: '#fff',
      //   fontSize: 16,
      // }]
    },
    tabBar: {
      animated: false,
      scrollEnabled: true,
      selectedColor: '#1dc4a2',
      color: '#bfbfbf',
      index: index || 0,
      // preload: 4,
      list: [
        {
          text: "首页",
          iconPath: "widget://image/tablayout/shouye.png",
          selectedIconPath: "widget://image/tablayout/shouye_active.png"
        }, {
          text: "订单",
          iconPath: "widget://image/tablayout/dingdan.png",
          selectedIconPath: "widget://image/tablayout/dingdan_active.png"
        }, {
          text: "还款",
          iconPath: "widget://image/tablayout/huankuan.png",
          selectedIconPath: "widget://image/tablayout/huankuan_active.png"
        }, {
          text: "我的",
          iconPath: "widget://image/tablayout/wode.png",
          selectedIconPath: "widget://image/tablayout/wode_active.png"
        }
      ],
      frames: [
        {
          title: "首页",//tab切换时对应的标题
          name: "tablayout/index",
          url: "widget://html/index/frm.html",
          bounces: true,
          reload: true,
          scrollToTop: true,
          //其他继承自openFrame的参数
        }, {
          title: "订单",
          name: "tablayout/order",
          url: "widget://html/order/frm.html",
          bounces: true,
          reload: true,
          scrollToTop: true,
          //其他继承自openFrame的参数
        }, {
          title: "还款",
          name: "tablayout/repay",
          url: "widget://html/repay/frm.html",
          bounces: true,
          reload: true,
          scrollToTop: true,
          //其他继承自openFrame的参数
        }, {
          title: "我的",
          name: "tablayout/my",
          url: "widget://html/my/frm.html",
          bounces: true,
          reload: true,
          scrollToTop: true,
          //其他继承自openFrame的参数
        }
      ]
    }
  })
}

// 注册
function openReg () {
  api.openWin({
    name: 'html/register/win',
    url: 'widget://html/register/win.html',
    bgColor: '#fff',
    reload: true,
  })
}

// 注册登录选择
function openRegLogin () {
  api.openWin({
    name: 'html/reglogin/win',
    url: 'widget://html/reglogin/win.html',
    bgColor: '#fff',
    reload: true,
    slidBackEnabled: false,
  })
}

// 个人登录
function openGerenLogin (pageParam) {
  api.openWin({
    name: 'html/gerenlogin/win',
    url: 'widget://html/gerenlogin/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam
  })
}

// 企业登录
function openQiyeLogin () {
  api.openWin({
    name: 'html/qiyelogin/win',
    url: 'widget://html/qiyelogin/win.html',
    bgColor: '#fff',
    reload: true,
  })
}

// 电话号码登录
function openSendCode (pageParam) {
  api.openWin({
    name: 'html/sendcode/win',
    url: 'widget://html/sendcode/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam
  })
}

// 找回密码
function openFindPwd () {
  api.openWin({
    name: 'html/findpwd/win',
    url: 'widget://html/findpwd/win.html',
    bgColor: '#fff',
    reload: true,
  })
}

// 填写个人信息
function openBaseinfoFill (pageParam) {
  api.openWin({
    name: 'html/baseinfofill/win',
    url: 'widget://html/baseinfofill/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam,
  })
}

// 打开待认证
function openTodoAuthGeren () {
  api.openTabLayout({
    name: 'html/todoauthgeren/win',
    title: '待完成',
    url: 'widget://html/todoauthgeren/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}
function openTodoAuthQiye () {
  api.openTabLayout({
    name: 'html/todoauthqiye/win',
    title: '待完成',
    url: 'widget://html/todoauthqiye/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    animation: {
      type: 'none'
    },
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 企业信息确认
function openCompanyInfo () {
  api.openTabLayout({
    name: 'html/companyinfo/win',
    title: '企业实名认证',
    url: 'widget://html/companyinfo/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 身份证上传
function openIDcardUpload () {
  api.openTabLayout({
    name: 'html/idcardupload/win',
    title: '身份证上传',
    url: 'widget://html/idcardupload/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 确认身份证信息
function openIDcardInfo (pageParam) {
  api.openTabLayout({
    name: 'html/idcardinfo/win',
    title: '确认身份证信息',
    url: 'widget://html/idcardinfo/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam,
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  })
}

// 人脸认证
function openFaceAuth (pageParam = {}) {
  api.openTabLayout({
    name: 'html/faceauth/win',
    title: pageParam.title,
    url: 'widget://html/faceauth/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam,
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 手持身份证上传
function openFaceUpload () {
  api.openTabLayout({
    name: 'html/faceupload/win',
    title: '手持身份证上传',
    url: 'widget://html/faceupload/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 预估额度
function openYuguEdu () {
  api.openTabLayout({
    name: 'html/yuguedu/win',
    title: '预估额度',
    url: 'widget://html/yuguedu/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 认证结果
function openAuthResult (status, message, title) { // status: success error during
  api.openTabLayout({
    name: 'html/authresult/win',
    title: title || '认证结果',
    url: 'widget://html/authresult/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      status, title, message
    },
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 消息中心
function openMsgCenter () {
  api.openTabLayout({
    name: 'html/msgcenter/win',
    title: '消息中心',
    url: 'widget://html/msgcenter/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 账号动态/新闻通知列表
function openMsgList (title) {
  api.openTabLayout({
    name: 'html/msglist/win',
    title: title || '',
    url: 'widget://html/msglist/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 消息详情
function openMsgDetails () {
  api.openTabLayout({
    name: 'html/msgdetails/win',
    title: '消息详情',
    url: 'widget://html/msgdetails/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 账单列表
function openBillList () {
  api.openTabLayout({
    name: 'html/billlist/win',
    title: '我的账单',
    url: 'widget://html/billlist/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 账单详情
function openBillDetails (id) {
  api.openTabLayout({
    name: 'html/billdetails/win',
    title: '账单详情',
    url: 'widget://html/billdetails/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 订单列表
function openOrderList () {
  api.openTabLayout({
    name: 'html/orderlist/win',
    title: '我的订单',
    url: 'widget://html/orderlist/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: false,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 订单详情
function openOrderDetails (id, type) {
  api.openTabLayout({
    name: 'html/orderdetails/win',
    title: '订单详情',
    url: 'widget://html/orderdetails/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id, type },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 我的额度
function openMyQuota () {
  api.openTabLayout({
    name: 'html/myquota/win',
    title: '我的额度',
    url: 'widget://html/myquota/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 我开通的产品
function openMyProduct () {
  api.openTabLayout({
    name: 'html/myproduct/win',
    title: '我开通的产品',
    url: 'widget://html/myproduct/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 设置
function openSettings () {
  api.openTabLayout({
    name: 'html/settings/win',
    title: '设置',
    url: 'widget://html/settings/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}


// 修改密码
function openChangePwd () {
  api.openTabLayout({
    name: 'html/changepwd/win',
    title: '修改密码',
    url: 'widget://html/changepwd/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 联系我们
function openContactUs () {
  api.openTabLayout({
    name: 'html/contactus/win',
    title: '联系我们',
    url: 'widget://html/contactus/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 还款计划
function openRepayPlan (id) {
  api.openTabLayout({
    name: 'html/repayplan/win',
    title: '还款计划',
    url: 'widget://html/repayplan/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 还款明细
function openRepayRecord (id) {
  api.openTabLayout({
    name: 'html/repayrecord/win',
    title: '还款记录',
    url: 'widget://html/repayrecord/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 订单详情
function openProductDetails (id) {
  api.openTabLayout({
    name: 'html/productdetails/win',
    title: '产品详情',
    url: 'widget://html/productdetails/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}

// 城市选择
function openCityList (pageParam) {
  api.openTabLayout({
    name: 'html/citylist/win',
    title: '城市选择',
    url: 'widget://html/citylist/win.html',
    bgColor: '#fff',
    pageParam,
    slidBackEnabled: true,
    navigationBar: {
      height: 45,
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })
}


export {
  openLeftPane,
  openDrawerLayout,
  openSlidLayout,
  openTabLayout,
  openReg,
  openRegLogin,
  openGerenLogin,
  openQiyeLogin,
  openSendCode,
  openFindPwd,
  openBaseinfoFill,
  openTodoAuthGeren,
  openTodoAuthQiye,
  openCompanyInfo,
  openIDcardUpload,
  openIDcardInfo,
  openFaceAuth,
  openFaceUpload,
  openYuguEdu,
  openAuthResult,
  openMsgCenter,
  openMsgList,
  openMsgDetails,
  openBillList,
  openBillDetails,
  openOrderList,
  openOrderDetails,
  openMyQuota,
  openMyProduct,
  openSettings,
  openChangePwd,
  openContactUs,
  openRepayPlan,
  openRepayRecord,
  openProductDetails,
  openCityList
}
