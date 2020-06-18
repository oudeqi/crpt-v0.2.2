import profile from './profile'

export default class Router {
  // 打开window级别页面
  static openPage = function ({ key, params }) {
    api.openTabLayout({
      ...profile[key],
      ...params
    })
  }
}