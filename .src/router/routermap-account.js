import { navigationBarWhite, navigationBarGreen } from './navbar-config'

// router page 配置信息
const routerConfig = {
  // 登录注册首页
  login_index: {
    name: 'login_index',
    url: 'widget://html/login_index/index.html',
    bgColor: '#fff',
    reload: true,
    slidBackEnabled: false,
  },
  // 账密登录页
  account_login: {
    name: 'account_login',
    url: 'widget://html/account_login/index.html',
    title: '',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 短信登录页
  sms_login: {
    name: 'sms_login',
    url: 'widget://html/sms_login/index.html',
    title: '',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 找回密码
  find_pwd: {
    name: 'find_pwd',
    url: 'widget://html/find_pwd/index.html',
    title: '',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  },
  // 修改密码
  change_pwd: {
    name: 'change_pwd',
    url: 'widget://html/change_pwd/win.html',
    title: '修改密码',
    bgColor: '#fff',
    reload: true,
    bounces: true,
    slidBackEnabled: true,
    navigationBar: navigationBarGreen
  },
  // 注册账号
  register: {
    name: 'register',
    url: 'widget://html/register/index.html',
    title: '注册',
    bgColor: '#fff',
    reload: true,
    navigationBar: navigationBarWhite
  }

}
export default routerConfig
