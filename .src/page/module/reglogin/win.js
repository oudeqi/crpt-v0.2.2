import '../../../app.css'
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
  api.parseTapmode();
  let header = $api.byId('header')
  $api.fixStatusBar(header)
  let headerPos = $api.offset(header)
  api.openFrame({
    name: 'html/reglogin/frm',
    url: 'widget://html/reglogin/frm.html',
    bounces: true,
    reload: true,
    rect: {
      x: 0,
      y: headerPos.h,
      w: 'auto',
      h: 'auto'
    }
  })

  api.addEventListener({
    name: 'keyback'
  }, function(ret, err) {
    // 安卓系统监听按返回键的事件即可阻止返回上一个界面，ios无此事件
    api.closeWidget({
      silent: false
    })
  })

  const ctrl = new PageController()

  api.addEventListener({
    name:'viewappear'
  }, function(ret, err){
    ctrl.getAndSaveProtocol()
  })

}
