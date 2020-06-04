import { http } from '../../config'
import numeral from 'numeral'
import { openDanbaoKaitong } from '../../webview.js'

class Service {
  // 获取担保状态
  queryDanbaoStatus () {
    return http.get('/crpt-guarantee/gt/apply/query')
  }
  // 保存担保申请
  saveApply (params) {
    return http.post('/crpt-guarantee/gt/apply/save', { body: params })
  }
  // 获取产品信息
  queryProductById (productId) {
    return http.get('/crpt-guarantee/gt/apply/queryProductInfo?productId=' + productId)
  }
  // 授信信息确认查询接口
  queryComfirmInfo (gtCreditId) {
    return http.get('/crpt-guarantee/gt/credit/confirm/query?gtCreditId=' + gtCreditId)
  }
}

export default class HeaderController extends Service {

  constructor () {
    super(...arguments)
    const { step, creditStatus } = api.pageParam || {}
    this.step = step // step 是当前页面的步骤
    this.creditStatus = creditStatus // 授信资料审核状态 1、审核中 2、授信成功 3、授信失败
    this.danbaoStatus = null
    this.applyStatusMap = {
      0: 'xxx', // int	无申请
      1: 'demandMoney', //	int	担保开通申请
      2: 'demandMoney', //	int	授信资料录入
      3: 'xxx', //	int	授信确认及签约
      4: 'xxx', //	int	绑定银行卡
      5: 'xxx', //	int	资方审核及签约
      6: 'xxx', //	int	预存担保费
      7: 'xxx', //	int	贷款支用
      100: 'xxx', //	int	已终结
    }
  }

  _renderStep () {
    const el = $api.byId('step')
    let creditStatus = this.creditStatus
    let step = this.step
    const prevStep = step - 1
    $api.addCls(el, `step${prevStep}`)
    setTimeout(() => {
      $api.removeCls(el, `step${prevStep}`)
      $api.addCls(el, `step${step}`)
    }, 300)
  }

  async _getDanbaoStatus () {
    try {
      const res = await this.queryDanbaoStatus()
      if (res.code === 200) {
        const data = res.data
        this.danbaoStatus = data
        let step = this.step
        if (step < 3) {
          let num = res.data[this.applyStatusMap[data.applyStatus]] || 0
          $api.byId('amount').innerHTML = numeral(num).multiply(10000).format('0,0.00')
          $api.byId('desc').innerHTML = `您正在申请${res.data.productName}产品`
        }
      }
    } catch (error) {
      if (this.step !== 1) {
        api.toast({ msg: error.msg || '出错啦', location: 'middle' })
      }
    }
  }

  _bindPrev () {
    let prev = $api.byId('prev')
    if (!prev) {
      return
    }
    prev.onclick = () => {
      let step = this.step
      if (step === 2) {
        step = 0
      } else {
        step--
      }
      openDanbaoKaitong({ step, back: true })
    }
  }

  async renderHeaderAndGetDanbaoStatus () {
    this._renderStep()
    this._bindPrev()
    return await this._getDanbaoStatus()
  }

}
