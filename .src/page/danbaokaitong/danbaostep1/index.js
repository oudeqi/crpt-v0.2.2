import '../header.css'
import '../form.css'
import './index.css'
import HeaderController from '../header.js'
import { Validation, NumberLimit } from '../form.js'
import { setRefreshHeaderInfo, getNodeProtocolFromStorage } from '../../../config.js'
import { openDanbaoKaitong, openAgreement } from '../../../webview.js'

class PageController extends HeaderController {

  constructor() {
    super(...arguments)
    const { productId, productName } = api.pageParam || {}
    this.productId = productId
    this.productName = productName
  }

  async getProduct () {
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      await this.renderHeaderAndGetDanbaoStatus()
    } catch (error) {}
    try {
      if (this.danbaoStatus) {
        const data = this.danbaoStatus
        document.querySelector('[name="buildType"][value="'+data.buildType+'"]').checked = true
        $api.byId('expectInveste').value = data.expectInveste
        $api.byId('demandMoney').value = data.demandMoney
        $api.byId('timeLimit').value = data.timeLimit
        $api.byId('agreement').checked = true
        $api.removeAttr($api.byId('save'), 'disabled')
        this.productId = data.productId
        this.productName = data.productName
        this.rate = data.rate
        let product = $api.byId('product')
        let rate = $api.byId('rate')
        $api.byId('product').value = data.productName
        $api.byId('rate').value = `${data.rate || '0'}‰`
        $api.byId('desc').innerHTML = `您正在申请${data.productName}产品`
      } else {
        const res = await this.queryProductById(this.productId)
        if (res.code === 200) {
          const data = res.data
          this.productId = data.productId
          this.productName = data.productName
          this.rate = data.rate
          let product = $api.byId('product')
          let rate = $api.byId('rate')
          $api.byId('product').value = data.productName
          $api.byId('rate').value = `${data.rate || '0'}‰`
          $api.byId('desc').innerHTML = `您正在申请${data.productName}产品`
          // 可编辑
          let buildType = Array.from(document.querySelectorAll('[name="buildType"]'))
          buildType.forEach(item => {
            $api.removeAttr(item, 'disabled')
          })
          $api.removeAttr($api.byId('expectInveste'), 'disabled')
          $api.removeAttr($api.byId('demandMoney'), 'disabled')
          $api.removeAttr($api.byId('timeLimit'), 'disabled')
          $api.removeAttr($api.byId('agreement'), 'disabled')
        }
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
    api.refreshHeaderLoadDone()
  }

  _initValidation () {
    const cfg = {
      agreement: {
        noRevert: true, // 不返回该字段，默认返回
        valid: {
          checked: '请仔细阅读协议，并同意'
        },
        get: function () {
          return $api.byId('agreement').checked
        }
      },
      buildType: {
        valid: {
          required: '请选择场地变化类型'
        },
        get: function () {
          const checkedRadio = document.querySelector('[name="buildType"]:checked')
          return checkedRadio ? checkedRadio.value : ''
        }
      },
      expectInveste: {
        valid: {
          max: [9999, '建厂预计投入不能超过9999'],
        },
        get: function () {
          return $api.byId('expectInveste').value
        }
      },
      demandMoney: {
        valid: {
          required: '资金需求不能为空'
        },
        get: function () {
          return $api.byId('demandMoney').value
        }
      },
      rate: {
        valid: {
          required: '综合费率不能为空'
        },
        get: function () {
          return $api.byId('rate').value
        }
      },
      timeLimit: {
        valid: {
          required: '请输入用款期限',
        },
        get: function () {
          return $api.byId('timeLimit').value
        }
      },
    }
    return new Validation(cfg)
  }

  async save () {
    const validation = this._initValidation()
    validation.validate({
      error: function (msg) {
        api.toast({ msg, location: 'middle' })
      },
      success: async (data) => {
        if (this.danbaoStatus && this.danbaoStatus.applyStatus > 0) {
          openDanbaoKaitong({step: 2})
          return
        }
        try {
          const res = await this.saveApply({
            ...data, productId: this.productId
          })
          if (res.code === 200) {
            const creditStatus = this.danbaoStatus || {}
            openDanbaoKaitong({step: 2, creditStatus})
          }
        } catch (error) {
          api.toast({ msg: error.msg || '出错啦', location: 'middle' })
        }
      }
    })
  }
}

apiready = function () {
  const pageController = new PageController()
  pageController.getProduct()
  // 下拉刷新
  setRefreshHeaderInfo(function(ret, err) {
    pageController.getProduct()
  })
  // 选填，客户录入（4位数）
  new NumberLimit($api.byId('expectInveste'))

  $api.byId('agreement').onchange = function (e) {
    let el = document.querySelector('#save')
    if ((e.target.checked)) {
      $api.removeAttr(el, 'disabled')
    } else {
      $api.attr(el, 'disabled', true)
    }
  }
  // 资金需求 可修改小额度
  $api.byId('demandMoney').oninput = function (e) {
    console.log(e.target.value)
  }
  // 用款期限 可修改小额度
  $api.byId('timeLimit').oninput = function (e) {
    console.log(e.target.value)
  }

  document.querySelector('#save').onclick = function () {
    pageController.save()
  }

  function showProtocol () {
    let node = getNodeProtocolFromStorage(4)
    if (!node) {
      api.toast({ msg: '协议不存在', location: 'middle' })
      return
    }
    let tpl = node.map(item => {
      return `<span>《</span><strong tapmode="active" data-name="${item.protocolName}" data-id="${item.protocolFileId}">${item.protocolName}</strong><span>》</span>`
    })
    $api.byId('protocol').innerHTML = tpl.join('、')
  }
  showProtocol()
  document.querySelector('#protocol').onclick = (e) => {
    let strong = $api.closest(e.target, 'strong')
    if (strong) {
      openAgreement(strong.dataset.id, strong.dataset.name)
    }
  }

}
