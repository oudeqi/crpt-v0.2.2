
function closeApp(){
  api.closeWidget()
}

function closeWin(){
  api.closeWin({})
}

function closeDrawer () {
  api.closeDrawerPane()
}

// api.lockSlidPane();
// api.unlockSlidPane

// 打开侧滑
function openLeftPane () {
  api.openWin({
    name: 'html/leftpane/win',
    url: 'widget://html/leftpane/win.html',
    bgColor: '#fff',
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
function openTabLayout () {
  api.openTabLayout({
    name: 'tabLayout',
    bgColor:'#fff',
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
      index: 3,
      preload: 4,
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
          scrollToTop: true,
          //其他继承自openFrame的参数
        }, {
          title: "订单",
          name: "tablayout/order",
          url: "widget://html/order/frm.html",
          bounces: true,
          scrollToTop: true,
          //其他继承自openFrame的参数
        }, {
          title: "还款",
          name: "tablayout/repay",
          url: "widget://html/repay/frm.html",
          bounces: true,
          scrollToTop: true,
          //其他继承自openFrame的参数
        }, {
          title: "我的",
          name: "tablayout/my",
          url: "widget://html/my/frm.html",
          bounces: true,
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
  })
}

// 注册登录选择
function openRegLogin () {
  api.openWin({
    name: 'html/reglogin/win',
    url: 'widget://html/reglogin/win.html',
    bgColor: '#fff',
    slidBackEnabled: false,
  })
}

// 个人登录
function openGerenLogin () {
  api.openWin({
    name: 'html/gerenlogin/win',
    url: 'widget://html/gerenlogin/win.html',
    bgColor: '#fff',
  })
}

// 企业登录
function openQiyeLogin () {
  api.openWin({
    name: 'html/qiyelogin/win',
    url: 'widget://html/qiyelogin/win.html',
    bgColor: '#fff',
  })
}

// 电话号码登录
function openSendCode () {
  api.openWin({
    name: 'html/sendcode/win',
    url: 'widget://html/sendcode/win.html',
    bgColor: '#fff',
  })
}

// 找回密码
function openFindPwd () {
  api.openWin({
    name: 'html/findpwd/win',
    url: 'widget://html/findpwd/win.html',
    bgColor: '#fff',
  })
}

// 填写个人信息
function openBaseinfoFill () {
  api.openWin({
    name: 'html/baseinfofill/win',
    url: 'widget://html/baseinfofill/win.html',
    bgColor: '#fff',
  })
}

// 打开待认证
function openTodoAuth () {
  api.openTabLayout({
    name: 'html/todoauth/win',
    title: '待认证',
    url: 'widget://html/todoauth/win.html',
    bgColor: '#fff',
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

// 企业信息确认
function openCompanyInfo () {
  api.openTabLayout({
    name: 'html/companyinfo/win',
    title: '企业信息',
    url: 'widget://html/companyinfo/win.html',
    bgColor: '#fff',
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
function openIDcardInfo () {
  api.openTabLayout({
    name: 'html/idcardinfo/win',
    title: '确认身份证信息',
    url: 'widget://html/idcardinfo/win.html',
    bgColor: '#fff',
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

// 人脸认证
function openFaceAuth () {
  api.openTabLayout({
    name: 'html/faceauth/win',
    title: '企业法人人脸认证',
    url: 'widget://html/faceauth/win.html',
    bgColor: '#fff',
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
function openAuthResult (type, title, message) {
  api.openTabLayout({
    name: 'html/authresult/win',
    title: '认证结果',
    url: 'widget://html/authresult/win.html',
    bgColor: '#fff',
    bounces: true,
    slidBackEnabled: false,
    // pageParam: {
    //   type: type,
    //   title: title,
    //   message: message
    // },
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
function openBillDetails () {
  api.openTabLayout({
    name: 'html/billdetails/win',
    title: '账单详情',
    url: 'widget://html/billdetails/win.html',
    bgColor: '#fff',
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
    title: '订单列表',
    url: 'widget://html/orderlist/win.html',
    bgColor: '#fff',
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

// 我的额度
function openMyQuota () {
  api.openTabLayout({
    name: 'html/myquota/win',
    title: '我的额度',
    url: 'widget://html/myquota/win.html',
    bgColor: '#fff',
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


export {
  closeApp,
  closeWin,
  closeDrawer,
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
  openTodoAuth,
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
  openMyQuota,
  openMyProduct,
  openSettings,
  openChangePwd,
  openContactUs
}