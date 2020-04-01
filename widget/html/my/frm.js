// api.unlockSlidPane
// 打开侧滑


function openLeftPane() {
  api.openWin({
    name: 'html/leftpane/win',
    url: 'widget://html/leftpane/win.html',
    bgColor: '#fff',
    bounces: false,
    slidBackEnabled: false,
    animation: {
      type: 'push',
      subType: 'from_left'
    }
  });
} // 抽布局


function openMsgCenter() {
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
      fontWeight: 'bold'
    }
  });
} // 账号动态/新闻通知列表


function openBillList() {
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
      fontWeight: 'bold'
    }
  });
} // 账单详情


function openOrderList() {
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
      fontWeight: 'bold'
    }
  });
} // 我的额度


function openMyQuota() {
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
      fontWeight: 'bold'
    }
  });
} // 我开通的产品


function openMyProduct() {
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
      fontWeight: 'bold'
    }
  });
} // 设置


function openSettings() {
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
      fontWeight: 'bold'
    }
  });
} // 修改密码


function openContactUs() {
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
      fontWeight: 'bold'
    }
  });
}

apiready = function apiready() {
  api.addEventListener({
    name: 'swiperight'
  }, function (ret, err) {
    openLeftPane();
  });

  document.querySelector('#msgcenter').onclick = function () {
    openMsgCenter();
  };

  document.querySelector('#billlist').onclick = function () {
    openBillList();
  };

  document.querySelector('#orderlist').onclick = function () {
    openOrderList();
  };

  document.querySelector('#myquota').onclick = function () {
    openMyQuota();
  };

  document.querySelector('#myproduct').onclick = function () {
    openMyProduct();
  };

  document.querySelector('#settings').onclick = function () {
    openSettings();
  };

  document.querySelector('#contactus').onclick = function () {
    openContactUs();
  };
};
