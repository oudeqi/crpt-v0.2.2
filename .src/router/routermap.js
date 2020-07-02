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
}
export default routerConfig