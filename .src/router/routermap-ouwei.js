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
  yjd_apply_status: {
    name: 'yjd_apply_status',
    title: '贷款申请',
    url: 'widget://html/yjd_apply_status/index.html',
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
  yjd_loan_signing: {
    name: 'yjd_loan_signing',
    title: '贷款签约',
    url: 'widget://html/yjd_loan_signing/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_signing_result: {
    name: 'yjd_signing_result',
    title: '签约结果',
    url: 'widget://html/yjd_signing_result/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  yjd_account_open: {
    name: 'yjd_account_open',
    title: '开通新网账户',
    url: 'widget://html/yjd_account_open/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
}

export default routerMap