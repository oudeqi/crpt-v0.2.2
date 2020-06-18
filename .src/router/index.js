import profile from './profile'

class Router {
  // 打开window级别页面
  openPage({ key, params }) {
    alert(2)
    api.openTabLayout({
      ...profile[key],
      ...params
    })
  }
}

export default new Router()