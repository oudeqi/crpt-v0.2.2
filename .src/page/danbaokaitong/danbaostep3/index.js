import '../header.css'
import '../form.css'
import './index.css'
import HeaderController from '../header.js'
import { setRefreshHeaderInfo } from '../../../config.js'
import { openSignOnline, openDanbaoKaitong } from '../../../webview.js'
import numeral from 'numeral'


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
    $api.byId('creditQuota').innerHTML = numeral(data.creditQuota || 0).format('0,0.00')
    $api.byId('effectiveNum').innerHTML = data.effectiveNum ? `${data.effectiveNum}月` : ''
    $api.byId('applyBeginDate').innerHTML = data.applyBeginDate ? data.applyBeginDate.split(' ')[0] : ''
    $api.byId('applyEndDate').innerHTML = data.applyEndDate ? data.applyEndDate.split(' ')[0] : ''
    $api.byId('relaManagerName').innerHTML = data.relaManagerName || ''
    $api.byId('relaManagerPhone').innerHTML = data.relaManagerPhone ? `(${data.relaManagerPhone})` : ''
  }

  _renderContract (arr) {
    let li = arr.map(item => {
      return `<li class="sign">《${item.contractTitle}》</li>`
    })
    $api.byId('contractList').innerHTML = `
    <h2>点击合同进入在线签约</h2>
    <ul>
      ${li.join('')}
    </ul>
    `
  }

  async getPageData () {
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      await this.renderHeaderAndGetDanbaoStatus()
      if (this.danbaoStatus) {
        const gtCreditId = this.danbaoStatus.gtCreditId
        const res = await this.queryComfirmInfo(gtCreditId)
        if (res.code === 200) {
          this._renderDom(res.data)
          this._renderContract(res.data.contractList || [])
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
  pageController.getPageData()
  setRefreshHeaderInfo(function(ret, err) {
    pageController.getPageData()
  })

  document.querySelector('body').onclick = function (e) {
    if (e.target.className.includes('sign')) {
      openSignOnline()
    }
  }

  $api.byId('next').onclick = function () {
    openDanbaoKaitong({step: 4})
  }

}
