import { navigationBarWhite, navigationBarGreen } from './navbar-config'

// router page 配置信息
const routerConfig = {
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
}
export default routerConfig