import { http } from '../../config'
import numeral from 'numeral'

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
    const { step } = api.pageParam || {}
    this.step = step
    this.applyStatusMap = {
      0: 'xxx', // int	无申请
      1: 'demandMoney', //	int	担保开通申请
      2: 'xxx', //	int	授信资料录入
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
    const step = this.step
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
        $api.byId('amount').innerHTML = numeral(res.data[this.applyStatusMap[data.applyStatus]] || 0).format('0,0.00')
        $api.byId('desc').innerHTML = `您正在申请${res.data.productName}产品`
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
  }

  async renderHeader () {
    this._renderStep()
    this._getDanbaoStatus()
  }
}
