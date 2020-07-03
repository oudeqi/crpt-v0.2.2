import { themeMainColor, textColor, navigationBarWhite, navigationBarGreen } from './navbar-config'

/**
 * themeMainColor 主题色
 * textColor 导航文字黑色
 * navigationBarWhite 浅色底导航
 * navigationBarGreen 绿色底导航
 */

const routerMap = {
  yjd_select_contract: {
    name: 'yjd_select_contract',
    title: '选择代养合同',
    url: 'widget://html/yjd_select_contract/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_apply_confirm: {
    name: 'yjd_apply_confirm',
    title: '申请贷款',
    url: 'widget://html/yjd_apply_confirm/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_hukouben_upload: {
    name: 'yjd_hukouben_upload',
    title: '上传户口本',
    url: 'widget://html/yjd_hukouben_upload/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_apply_result: {
    name: 'yjd_apply_result',
    title: '贷款申请',
    url: 'widget://html/yjd_apply_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 押金贷产品详情
  yjd_product_detail: {
    name: 'yjd_product_detail',
    title: '产品详情',
    url: 'widget://html/yjd_product_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  }
}

export default routerMap