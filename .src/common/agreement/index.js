import './index.css'

import { openRepayPlan, openRepayRecord } from '../../webview.js'
import { http, setRefreshHeaderInfo } from '../../config.js'

class Service {

  queryArgument (gtCreditId) {
    return http.get('/crpt-biz/biz/platform/protocol/app/query')
  }

}

class PageController extends Service {
  constructor() {
    super(...arguments)
  }

  _pageDataFillBack (data) {

  }

  async getPageData () {
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      const res = await this.queryArgument()
      if (res.code === 200) {
        this._pageDataFillBack(res.data)
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

  const office = api.require('officePreview')

  api.download({
    url: 'http://gateway.dev.hzero.oak.net.cn/crpt-ms/v1/%7BorganizationId%7D/service/picture/download/353',
    savePath: 'fs://aaa.docx',
    report: true,
    cache: true,
    allowResume: true
  }, function(ret, err) {
    if (ret.state == 1) {
      console.log('下载成功')
      office.open({
        rect: { x: 0, y: 0,w: 'auto', h: 'auto'},
        fixedOn: api.frameName,
        fixed: false,
        url: ret.savePath,
        fileType: 'docx'
      })
    } else {
      console.log('下载失败')
    }
  })

  // document.querySelector('#apply').onclick = function (event) {
  //   api.alert({
  //     title: '提示',
  //     msg: '功能开发中...',
  //   })
  // }
}
