import './index.css'

import { openRepayPlan, openRepayRecord } from '../../webview.js'
import { http, setRefreshHeaderInfo } from '../../config.js'

class Service {

  queryArgument (gtCreditId) {
    return http.get('/crpt-biz/biz/platform/protocol/app/query')
  }

  docx2html (id) {
    return http.get('/crpt-file/file/docx2html?id=' + id)
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
    const { useNode } = api.pageParam || {}
    this.useNode = useNode
  }

  _pageDataFillBack (data) {
    if (data.count > 0) {
      let map = {}
      data.list.forEach(item => {
        map[item.useNode] = item.protocolFileId
      })
      this.useNodeMap = map
    }
  }

  async _getAndRenderHtml () {
    try {
      let id = this.useNodeMap[this.useNode]
      if (!id) {
        api.toast({ msg: '协议内容不存在', location: 'middle' })
        return
      }
      const res = await this.docx2html(id)
      if (res.code === 200) {
        $api.byId('doc').innerHTML = res.data.fileName
      } else {
        api.toast({ msg: '获取协议内容失败', location: 'middle' })
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
  }

  async getPageData () {
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      const res = await this.queryArgument()
      if (res.code === 200) {
        this._pageDataFillBack(res.data)
        this._getAndRenderHtml()
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
    api.refreshHeaderLoadDone()
  }

}

apiready = function () {

  const ctrl = new PageController()
  ctrl.getPageData()
}
