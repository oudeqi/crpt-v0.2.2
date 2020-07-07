import './index.css'

import { openRepayPlan, openRepayRecord } from '../../webview.js'
import { http, setRefreshHeaderInfo } from '../../config.js'

class Service {

  docx2html(id) {
    return http.get('/crpt-file/file/docx2html?id=' + id)
  }
  pdf2html(id) {
    return http.get(`/crpt-file/file/pdf2html?pdfFileId=${id}`)
  }
}

class PageController extends Service {
  // useNode 适用节点。
  // 1-用户注册，
  // 2-实名认证，
  // 3-产品开户，
  // 4-产品开通，
  // 5-产品绑卡
  constructor() {
    super(...arguments)
    const { id, type } = api.pageParam || {}
    this.id = id
    this.type = type || 'doc'
  }

  async getPageData() {
    if (!this.id) {
      api.toast({ msg: '协议内容不存在', location: 'middle' })
      return
    }
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      let res = null
      if (this.type === 'doc') {
        res = await this.docx2html(this.id)
      } else if (this.type === 'pdf') {
        res = await this.pdf2html(this.id)
      }
      if (res.code === 200) {
        $api.byId('doc').innerHTML = res.data.fileName
      } else {
        api.toast({ msg: '获取协议内容失败', location: 'middle' })
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
    api.refreshHeaderLoadDone()
  }

}

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  const ctrl = new PageController()
  ctrl.getPageData()
}
