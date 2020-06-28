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
}

export default routerMap