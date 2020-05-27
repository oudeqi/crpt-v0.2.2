import '../header.css'
import '../form.css'
import './index.css'
import HeaderController from '../header.js'
import { setRefreshHeaderInfo } from '../../../config.js'
import { openSignOnline } from '../../../webview.js'


class PageController extends HeaderController {
  constructor() {
    super(...arguments)
    const { productId, productName } = api.pageParam || {}
    this.productId = productId
    this.productName = productName
  }

  _renderDom (data) {
    $api.byId('productName').innerHTML = data.productName || ''
    $api.byId('productName2').innerHTML = data.productName || ''
    $api.byId('custName').innerHTML = data.custName || ''
    $api.byId('custPhone').innerHTML = data.custPhone ? `(${data.custPhone})` : ''
    $api.byId('creditQuota').innerHTML = data.creditQuota || ''
    $api.byId('effectiveNum').innerHTML = data.effectiveNum ? `${data.effectiveNum}月` : ''
    $api.byId('applyBeginDate').innerHTML = data.applyBeginDate ? data.applyBeginDate.split(' ')[0] : ''
    $api.byId('applyEndDate').innerHTML = data.applyEndDate ? data.applyEndDate.split(' ')[0] : ''
    $api.byId('relaManagerName').innerHTML = data.relaManagerName || ''
    $api.byId('relaManagerPhone').innerHTML = data.relaManagerPhone ? `(${data.relaManagerPhone})` : ''
  }

  async getPageData () {
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      const status = await this.queryDanbaoStatus()
      console.log('JSON.stringify(status)')
      console.log(JSON.stringify(status))
      if (status.code === 200) {
        const gtCreditId = status.data.gtCreditId
        const res = await this.queryComfirmInfo(gtCreditId)
        if (res.code === 200) {
          this._renderDom(res.data)
        }
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
    api.refreshHeaderLoadDone()
  }
}

apiready = function () {

  const pageController = new PageController()
  pageController.renderHeader()
  pageController.getPageData()
  setRefreshHeaderInfo(function(ret, err) {
    pageController.getPageData()
  })

  document.querySelector('body').onclick = function (e) {
    if (e.target.className.includes('sign')) {
      openSignOnline()
    }
  }
}
