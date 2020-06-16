
// api.lockSlidPane();
// api.unlockSlidPane
const navigationBarWhite = {
  hideBackButton: false,
  background: '#fff',
  color: 'rgba(48,49,51,1)',
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [
    {
      text: '',
      color: 'rgba(102,187,106,1)',
      iconPath: 'widget://image/back_green_big.png',
    }
  ]
}
const navigationBarGreen = {
  hideBackButton: false,
  background: 'rgba(102,187,106,1)',
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [
    {
      text: '',
      color: '#fff',
      iconPath: 'widget://image/back_white_big.png',
    }
  ]
}
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
  text: '',
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
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'normal',
      // leftButtons: [{
      //   // text: '设置',
      //   // color: '#fff',
      //   // fontSize: 16,
      //   iconPath: 'widget://image/avatar.png',
      // }],
      // rightButtons: [{
      //   text: '设置',
      //   color: '#fff',
      //   fontSize: 16,
      //   // iconPath: 'widget://image/settings@2x.png'
      // }]
    },
    tabBar: {
      animated: false,
      scrollEnabled: true,
      selectedColor: '#66BB6A',
      color: '#606266',
      index: index || 0,
      fontSize: 12,
      // preload: 4,
      list: [
        {
          text: "首页",
          iconPath: "widget://image/tablayout/shouye.png",
          selectedIconPath: "widget://image/tablayout/shouye_active.png"
        }, {
          text: "贷款",
          iconPath: "widget://image/tablayout/loan.png",
          selectedIconPath: "widget://image/tablayout/loan_active.png"
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
          title: "待申请",
          name: "tablayout/loan",
          url: "widget://html/loan/index.html",
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
  api.openTabLayout({
    name: 'html/register/index',
    url: 'widget://html/register/index.html',
    title: '注册',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  })
}

// 注册登录选择
function openRegLogin () {
  api.openTabLayout({
    name: 'html/reglogin/index',
    url: 'widget://html/reglogin/index.html',
    bgColor: '#fff',
    reload: true,
    slidBackEnabled: false,
  })
}

// 个人登录
function openGerenLogin ({ userType = 1 } = {}) {
  // 2企业 1个人
  api.openTabLayout({
    name: 'html/gerenlogin/index',
    url: 'widget://html/gerenlogin/index.html',
    title: '',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      userType
    },
    navigationBar: navigationBarWhite
  })
}

// 企业登录
function openQiyeLogin () {
  api.openTabLayout({
    name: 'html/qiyelogin/index',
    url: 'widget://html/qiyelogin/index.html',
    title: '',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  })
}

// 电话号码登录
function openSendCode ({tel, userType} = {}) {
  // 个人登录 1, 企业登录 2
  api.openTabLayout({
    name: 'html/sendcode/index',
    url: 'widget://html/sendcode/index.html',
    title: '',
    bgColor: '#fff',
    pageParam: {
      tel, userType
    },
    reload: true,
    navigationBar: navigationBarWhite
  })
}

// 找回密码
function openFindPwd () {
  api.openTabLayout({
    name: 'html/findpwd/index',
    url: 'widget://html/findpwd/index.html',
    title: '',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  })
}

// 填写个人信息
function openBaseinfoFill () {
  api.openTabLayout({
    name: 'html/baseinfofill/win',
    title: '补充基本信息',
    url: 'widget://html/baseinfofill/win.html',
    bgColor: '#fff',
    softInputMode: 'auto',
    softInputBarEnabled: false,
    // softInputDismissMode: ['tap', 'interactive'],
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
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
      ...navigationBarWhite,
      hideBackButton: true,
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
      ...navigationBarWhite,
      hideBackButton: true,
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
    softInputMode: 'auto',
    softInputBarEnabled: false,
    reload: true,
    bounces: true,
    slidBackEnabled: false,
    navigationBar: navigationBarGreen
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
    navigationBar: navigationBarGreen
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
    navigationBar: navigationBarGreen
  })
}

// 人脸认证
function openFaceAuth ({ title, userType } = {}) {
  api.openTabLayout({
    name: 'html/faceauth/win',
    title: title || '人脸识别',
    url: 'widget://html/faceauth/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      title, userType
    },
    bounces: true,
    slidBackEnabled: false,
    navigationBar: navigationBarGreen
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
    navigationBar: navigationBarGreen
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
    navigationBar: navigationBarGreen
  })
}

// 认证结果
function openAuthResult ({status, message, title, tips}) { // status: success error during
  api.openTabLayout({
    name: 'html/authresult/win',
    title: title || '认证结果',
    url: 'widget://html/authresult/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      status, title, message, tips
    },
    bounces: true,
    slidBackEnabled: false,
    navigationBar: navigationBarGreen
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
    navigationBar: navigationBarWhite
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
    navigationBar: navigationBarWhite
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
    navigationBar: navigationBarWhite
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
    navigationBar: navigationBarWhite
  })
}

// 账单详情
function openBillDetails (id, {
  billDate,
  sumRepayTotalAmount,
  sumRepayPrincipalAmount,
  sumServiceFee,
  sumRepayPenaltyAmount,
  sumRepayInterestAmount,
} = {}) {
  api.openTabLayout({
    name: 'html/billdetails/win',
    title: '账单详情',
    url: 'widget://html/billdetails/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: {
      id,
      billDate,
      sumRepayTotalAmount,
      sumRepayPrincipalAmount,
      sumServiceFee,
      sumRepayPenaltyAmount,
      sumRepayInterestAmount,
    },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  })
}

// 我的贷款
function openMyLoan () {
  api.openTabLayout({
    name: 'html/myloan/win',
    title: '我的贷款',
    url: 'widget://html/myloan/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: false,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  })
}

// 订单详情
function openOrderDetails (id) {
  api.openTabLayout({
    name: 'html/orderdetails/win',
    title: '贷款详情',
    url: 'widget://html/orderdetails/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  })
}

// 贷款申请
function openLoanApplication (id) {
  api.openTabLayout({
    name: 'html/loanapplication/index',
    title: '待申请',
    url: 'widget://html/loanapplication/index.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'normal',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
    }
  })
}

// 贷款确认
function openLoanConfirm (id) {
  api.openTabLayout({
    name: 'html/loanconfirm/index',
    title: '贷款确认',
    url: 'widget://html/loanconfirm/index.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'normal',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
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
    navigationBar: navigationBarGreen
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
    navigationBar: navigationBarWhite
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
    navigationBar: navigationBarWhite
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
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
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
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
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
    navigationBar: navigationBarWhite
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
    navigationBar: navigationBarWhite
  })
}

// 订单详情
function openProductDetails ({id, open} = {}) {
  api.openTabLayout({
    name: 'html/productdetails/win',
    title: '产品详情',
    url: 'widget://html/productdetails/win.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id, open }, // open 1 已开通， 0未开通
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
    }
  })
}

// 城市选择
function openCityList ({ eventName }) {
  api.openTabLayout({
    name: 'html/citylist/win',
    title: '城市选择',
    url: 'widget://html/citylist/win.html',
    bgColor: '#fff',
    pageParam: { eventName },
    slidBackEnabled: true,
    animation: {
      type: 'none'
    },
    navigationBar: {
      height: 44,
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
    }
  })
}

// 产品推荐
function openProductRecommend (pageParam) {
  api.openTabLayout({
    name: 'html/productrecommend/win',
    title: '产品推荐',
    url: 'widget://html/productrecommend/win.html',
    bgColor: '#fff',
    pageParam,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
    }
  })
}


// 开通担保
function openDanbaoKaitong ({step, title = '普惠担保', productId, creditStatus, back = false} = {}) {
  let i = step
  if (step === 0) {
    i = 1
  } else if (step === 1) {
    i = 2
  } else if (step === 2) {
    if (creditStatus && creditStatus === 2) {
      i = 3
    } else {
      i = 2
    }
  } else if (step >= 7) {
    i = 6
  }
  // back 当页面是返回时传递true
  // productId 只在第一步会用到
  // creditStatus 在第二步或者第三步会用到
  // step 在3以及三之后，就是当前页面的步骤，2以及2之前是当前的担保申请状态
  // 想去第一步，step传0
  // 想去第二步，step传1、或者step传2，creditStatus非2
  // 想去第三步，step传3、或者step传2，creditStatus传2
  // 想去第四步，step传4
  // 想去第五步，step传5
  // 想去第六步，step传6
  let animation = back ? {
    animation: {
      type: 'push',
      subType: 'from_left',
    }
  } : {
    animation: {
      type: 'push',
      subType: 'from_right',
    }
  }
  api.openTabLayout({
    name: `html/danbaostep${i}/index`,
    title: title,
    url: `widget://html/danbaostep${i}/index.html`,
    bgColor: '#fff',
    pageParam: {
      title,
      step: i,
      productId,
      creditStatus // 授信资料审核状态 1、审核中 2、授信成功 3、授信失败
    },
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 16,
      fontWeight: 'normal',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
    },
    ...animation
  })
}

// 担保人列表
function openDanbaoRenList ({gtCreditId, gtId, productId, demandMoney} = {}) {
  api.openTabLayout({
    name: `html/danbaorenlist/index`,
    title: '担保人列表',
    url: `widget://html/danbaorenlist/index.html`,
    bgColor: 'rgba(245,245,245,1)',
    pageParam: {
      gtCreditId, // 担保授信id
      productId, // 产品id
      demandMoney, // 资金需求
      gtId, // 担保id
    },
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#fff',
      color: 'rgba(48,49,51,1)',
      fontSize: 18,
      fontWeight: 'normal',
      leftButtons: [{
        text: '',
        color: 'rgba(102,187,106,1)',
        iconPath: 'widget://image/back_green_big.png',
      }],
    }
  })
}

// 担保人信息录入
function openDanbaoRenForm ({gtCreditId, gtCounterId, type, status}) {
  api.openTabLayout({
    name: `html/danbaorenform/index`,
    title: '担保人调查表',
    url: `widget://html/danbaorenform/index.html`,
    bgColor: 'rgba(245,245,245,1)',
    pageParam: {
      gtCreditId, // 授信id
      gtCounterId, // 担保人id
      type, // 反担保人类别,
      status,
      // status 反担保人状态
      // 0：未填写信息   1：待发送  2：确认中  3：已确认   4：已作废  5：已签约  6：已拒签  ，默认为：0。
    },
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#fff',
      color: 'rgba(48,49,51,1)',
      fontSize: 18,
      fontWeight: 'normal',
      leftButtons: [{
        text: '',
        color: 'rgba(102,187,106,1)',
        iconPath: 'widget://image/back_green_big.png',
      }],
    }
  })
}

// 文书送达地址
function openSendAddress ({gtId, gtCreditId}) {
  api.openTabLayout({
    name: `html/sendaddress/index`,
    title: '文书送达地址',
    url: `widget://html/sendaddress/index.html`,
    bgColor: 'rgba(245,245,245,1)',
    pageParam: {
      gtId, // 担保申请的id
      gtCreditId // 担保授信id
    },
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: '#fff',
      color: 'rgba(48,49,51,1)',
      fontSize: 18,
      fontWeight: 'normal',
      leftButtons: [{
        text: '',
        color: 'rgba(102,187,106,1)',
        iconPath: 'widget://image/back_green_big.png',
      }],
    }
  })
}


// 在线签约
function openSignOnline (id) {
  api.openTabLayout({
    name: 'html/signonline/index',
    title: '在线签约',
    url: 'widget://html/signonline/index.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'normal',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
    }
  })
}

// 协议
function openAgreement (id, name) {
  api.openTabLayout({
    name: 'html/agreement/index',
    title: name || '协议',
    url: 'widget://html/agreement/index.html',
    bgColor: '#fff',
    reload: true,
    pageParam: { id, name },
    bounces: true,
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'normal',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
    }
  })
}

// 房产信息
function openFangchan ({
  gtId, // 担保申请id
  flowStatus,
  gtCreditId, // 担保授信id
  type, // 反担保人传 2 其他穿1
  gtCounterId, // 担保人id
  _cb, // 字符串的回调函数
}) {
  api.openTabLayout({
    title: '房产信息',
    name: 'html/guarantee_application_house/index',
    url: 'widget://html/guarantee_application_house/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: {
      gtId,
      flowStatus,
      gtCreditId,
      type,
      gtCounterId,
      _cb,
    },
    navigationBar: {
      background: '#fff',
      color: '#303133',
      fontSize: 18,
      fontWeight: 500,
      leftButtons: [
        {
          text: '',
          color: 'rgba(102,187,106,1)',
          iconPath: 'widget://image/back_green_big.png',
        }
      ]
    }
  })
}
// 车辆信息
function openCheliang ({
  gtId, // 担保申请id
  flowStatus,
  gtCreditId, // 担保授信id
  type, // 反担保人传 2 其他穿1
  gtCounterId, // 担保人id
  _cb, // 字符串的回调函数
}) {
  api.openTabLayout({
    title: '车辆信息',
    name: 'html/guarantee_application_car/index',
    url: 'widget://html/guarantee_application_car/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    pageParam: {
      gtId,
      flowStatus,
      gtCreditId,
      type,
      gtCounterId,
      _cb,
    },
    navigationBar: {
      background: '#fff',
      color: '#303133',
      fontSize: 18,
      fontWeight: 500,
      leftButtons: [
        {
          text: '',
          color: 'rgba(102,187,106,1)',
          iconPath: 'widget://image/back_green_big.png',
        }
      ]
    }
  })
}

// 产品列表
function openProductList (type) { // 1-信用贷款 2-担保贷款
  api.openTabLayout({
    name: 'html/productlist/win',
    title: '产品推荐',
    url: 'widget://html/productlist/index.html',
    bgColor: '#fff',
    pageParam: { type },
    slidBackEnabled: true,
    navigationBar: {
      hideBackButton: false,
      background: 'rgba(102,187,106,1)',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      leftButtons: [
        {
          text: '',
          color: '#fff',
          iconPath: 'widget://image/back_white_big.png',
        }
      ]
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
  openMyLoan,
  openOrderDetails,
  openLoanApplication,
  openLoanConfirm,
  openMyQuota,
  openMyProduct,
  openSettings,
  openChangePwd,
  openContactUs,
  openRepayPlan,
  openRepayRecord,
  openProductDetails,
  openCityList,
  openProductRecommend,
  openDanbaoKaitong,
  openDanbaoRenList,
  openDanbaoRenForm,
  openSignOnline,
  openSendAddress,
  openAgreement,
  openCheliang,
  openFangchan,
  openProductList,
}
