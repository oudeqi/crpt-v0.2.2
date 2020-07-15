import { navigationBarWhite, navigationBarGreen } from './navbar-config'

// router page 配置信息
const routerConfig = {
  // 消息中心
  msgcenter: {
    name: 'html/msgcenter/win',
    title: '消息中心',
    url: 'widget://html/msgcenter/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 我的账单
  billlist: {
    name: 'html/billlist/win',
    title: '我的账单',
    url: 'widget://html/billlist/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 账单详情
  billdetails: {
    name: 'html/billdetails/win',
    title: '账单详情',
    url: 'widget://html/billdetails/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 我的贷款
  my_loan: {
    name: 'html/my_loan/win',
    title: '我的贷款',
    url: 'widget://html/my_loan/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: false,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 我的额度
  my_quota: {
    name: 'html/my_quota/index',
    title: '我的额度',
    url: 'widget://html/my_quota/index.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 已开通的产品
  myproduct: {
    name: 'html/myproduct/win',
    title: '我开通的产品',
    url: 'widget://html/myproduct/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 联系我们
  contactus: {
    name: 'html/contactus/win',
    title: '联系我们',
    url: 'widget://html/contactus/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 设置
  settings: {
    name: 'html/settings/win',
    title: '设置',
    url: 'widget://html/settings/win.html',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarWhite
  },
  // 我的钱包详情
  wallet: {
    name: 'wallet',
    title: '希望钱包',
    url: 'widget://html/wallet/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 通用产品列表
  com_product_list: {
    name: 'com_product_list',
    title: '产品列表',
    url: 'widget://html/com_product_list/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 合同页
  agreement: {
    name: 'agreement',
    title: '查看合同',
    url: 'widget://html/agreement/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 还款试算页面
  com_repay_trial: {
    name: 'com_repay_trial',
    title: '还款试算',
    url: 'widget://html/com_repay_trial/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 还款结果页面
  com_repay_result: {
    name: 'com_repay_result',
    title: '还款结果',
    url: 'widget://html/com_repay_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  }
}
export default routerConfig