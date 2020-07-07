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
  // 押金贷产品详情
  yjd_product_detail: {
    name: 'yjd_product_detail',
    title: '产品详情',
    url: 'widget://html/yjd_product_detail/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 贷款申请
  loan_application: {
    name: 'loan_application',
    title: '待申请',
    url: 'widget://html/loan_application/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarGreen
  },
  // 贷款确认
  loan_confirm: {
    name: 'loan_confirm',
    title: '贷款确认',
    url: 'widget://html/loan_confirm/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarGreen
  },
  // 押金贷贷款详情
  yjd_loan_details: {
    name: 'yjd_loan_details',
    title: '贷款详情',
    url: 'widget://html/yjd_loan_details/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 公用的贷款详情
  loan_details: {
    name: 'loan_details',
    title: '贷款详情',
    url: 'widget://html/loan_details/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 还款计划
  repay_plan: {
    name: 'repay_plan',
    title: '还款计划',
    url: 'widget://html/repay_plan/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 还款记录
  repay_record: {
    name: 'repay_record',
    title: '还款记录',
    url: 'widget://html/repay_record/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 押金贷代养合同
  yjd_contract_daiyang: {
    name: 'yjd_contract_daiyang',
    title: '代养合同',
    url: 'widget://html/yjd_contract_daiyang/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 押金贷贷款合同
  yjd_contract_loan: {
    name: 'yjd_contract_loan',
    title: '贷款合同',
    url: 'widget://html/yjd_contract_loan/index.html',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  }
}

export default routerMap