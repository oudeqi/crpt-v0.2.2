import ouweiRouterMap from './routermap-ouwei'
// 主题色
const themeMainColor = 'rgba(102,187,106,1)'
// 导航文字黑色
const textColor = 'rgba(48,49,51,1)'

// 浅色底导航
const navigationBarWhite = {
  hideBackButton: false,
  background: '#fff',
  color: textColor,
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [
    {
      text: '',
      color: themeMainColor,
      iconPath: 'widget://image/back_green_big.png',
    }
  ]
}

// 绿色底导航
const navigationBarGreen = {
  hideBackButton: false,
  background: themeMainColor,
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

// router page 配置信息
const routerMapConfig = {
  // 好销贷授信申请
  hxd_apply: {
    name: 'hxd_apply',
    title: '产品介绍',
    url: 'widget://html/hxd_apply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷授信申请补充企业信息
  hxd_a_supply: {
    name: 'hxd_a_supply',
    title: '补充企业信息',
    url: 'widget://html/hxd_a_supply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷授信申请成功/失败
  hxd_a_success: {
    name: 'hxd_a_success',
    title: '产品开通',
    url: 'widget://html/hxd_a_success/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarGreen
  },
  // 好销贷产品详情
  hxd_product_detail: {
    name: 'hxd_product_detail',
    title: '产品详情',
    url: 'widget://html/hxd_product_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷额度变化详情
  hxd_quota: {
    name: 'hxd_quota',
    title: '额度变化详情',
    url: 'widget://html/hxd_quota/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷用款申请
  hxd_u_apply: {
    name: 'hxd_u_apply',
    title: '申请用款',
    url: 'widget://html/hxd_u_apply/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷用款确认
  hxd_u_confirm: {
    name: 'hxd_u_confirm',
    title: '用款确认',
    url: 'widget://html/hxd_u_confirm/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷用款校验
  hxd_u_smscode: {
    name: 'hxd_u_smscode',
    title: '用款校验',
    url: 'widget://html/hxd_u_smscode/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 好销贷用款结果
  hxd_u_result: {
    name: 'hxd_u_result',
    title: '审核结果',
    url: 'widget://html/hxd_u_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
}

export default {
  ...routerMapConfig,
  ...ouweiRouterMap
}