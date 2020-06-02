import '../../../app.css'
import './frm.css'

import {
  openReg, openGerenLogin, openQiyeLogin
} from '../../../webview.js'
import { http, saveProtocolToStorage } from '../../../config.js'

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

  async getAndSaveProtocol () {
    try {
      const res = await this.queryArgument()
      if (res.code === 200) {
        if (res.data.count > 0) {
          saveProtocolToStorage(res.data.list)
        } else {
          api.toast({ msg: '没有获取到协议', location: 'middle' })
        }
      }
    } catch (error) {
      api.toast({ msg: error.msg || '获取协议失败', location: 'middle' })
    }
  }


}

apiready = function() {
  const ctrl = new PageController()
  ctrl.getAndSaveProtocol()
  ctrl.bindEvent()

}
