function openRepayPlan() {
  api.openTabLayout({
    name: 'html/repayplan/win',
    title: '还款计划',
    url: 'widget://html/repayplan/win.html',
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
} // 还款明细


function openRepayRecord() {
  api.openTabLayout({
    name: 'html/repayrecord/win',
    title: '还款明细',
    url: 'widget://html/repayrecord/win.html',
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
} // 订单详情

apiready = function apiready() {
  document.querySelector('#repayplan').onclick = function () {
    openRepayPlan();
  };

  document.querySelector('#repayrecord').onclick = function () {
    openRepayRecord();
  };

};
