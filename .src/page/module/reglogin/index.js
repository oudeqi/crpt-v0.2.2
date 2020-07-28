import '../../../app.css'
import './index.css'
import { http, saveProtocolToStorage } from '../../../config.js'
import { openReg, openGerenLogin, openQiyeLogin } from '../../../webview.js'

// 获取平台所有协议
class Service {
  queryArgument () {
    return http.get('/crpt-biz/biz/platform/protocol/app/query')
  }
}

class PageController extends Service {

  constructor() {
    super(...arguments)
  }

  async getAndSaveProtocol () {
    try {
      const res = await this.queryArgument()
      if (res.code === 200) {
        if (res.data.count > 0) {
          saveProtocolToStorage(res.data.list)
        } else {
          saveProtocolToStorage([])
          api.toast({ msg: '没有获取到协议', location: 'middle' })
        }
      }
    } catch (error) {
      saveProtocolToStorage([])
      api.toast({ msg: error.msg || '获取协议失败', location: 'middle' })
    }
  }

  bindEvent () {

    document.querySelector('#register').onclick = function () {
      openReg()
    }

    document.querySelectorAll('.login').forEach(element => {
      element.onclick = function () {
        if (this.dataset.type === 'geren') {
          openGerenLogin()
        } else {
          openQiyeLogin()
        }
      }
    })
  }
}

apiready = function() {

  api.closeWin({ name: 'html/todoauthgeren/win' })
  api.closeWin({ name: 'html/todoauthqiye/win' })

  const ctrl = new PageController()
  ctrl.bindEvent()

  api.addEventListener({
    name: 'keyback'
  }, function(ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })

  api.addEventListener({
    name:'viewappear'
  }, function(ret, err){
    ctrl.getAndSaveProtocol()
  })

}
