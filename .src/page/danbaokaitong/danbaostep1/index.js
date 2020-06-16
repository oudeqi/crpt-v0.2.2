import '../../../app.css'
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
    this.productType = null
    /*
      1. productType 字段用来表示是否是担保类型中的设备贷
      2. productType 含义与原本的产品类型不太一样，原本产品类型分为：1-信用贷款 2-担保贷款
      3. 由于没有表示设备贷的字段，与后端同事达成共识，1信用贷产品，2担保贷产品中的设备贷，如果以后新增其他类型在后面顺延
    */
  }

  // 判断是否是设备贷
  __isShebeiDai () {
    return this.productType === '2' || this.productType === 2
  }

  // 隐藏设备贷
  __hideShebeiDai () {
    $api.byId('shebeidai_container').style.display = 'none'
  }

  // 根据产品id，显示或者隐藏设备贷
  __isShebeiDaiShow (productType) {
    if (this.__isShebeiDai()) {
      $api.byId('shebeidai_container').style.display = 'block'
    } else {
      $api.byId('shebeidai_container').style.display = 'none'
    }
  }

  // 获取产品信息
  async getProduct () {
    api.showProgress({ title: '加载中...', text: '', modal: false })
    this.__setDisabled()
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
        this.productType = data.productType
        $api.byId('product').value = data.productName
        $api.byId('rate').value = `${data.rate || '0'}‰`
        $api.byId('desc').innerHTML = `您正在申请${data.productName}产品`
        this.__isShebeiDaiShow(data.productType)
        this.__removeDisabled()
      } else {
        const res = await this.queryProductById(this.productId)
        if (res.code === 200) {
          const data = res.data
          this.productId = data.productId
          this.productName = data.productName
          this.productType = data.productType
          $api.byId('product').value = data.productName
          $api.byId('rate').value = `${data.rate || '0'}‰`
          $api.byId('desc').innerHTML = `您正在申请${data.productName}产品`
          this.__isShebeiDaiShow(data.productType)
          this.__removeDisabled()
        }
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
    api.refreshHeaderLoadDone()
  }

  __setDisabled () {// 不可编辑
    let buildType = Array.from(document.querySelectorAll('[name="buildType"]'))
    buildType.forEach(item => {
      $api.attr(item, 'disabled', true)
    })
    $api.attr($api.byId('agreement'), 'disabled', true)
    $api.attr($api.byId('expectInveste'), 'disabled', true)
    $api.attr($api.byId('expectInveste'), 'placeholder', '')

    $api.attr($api.byId('demandMoney'), 'disabled', true)
    $api.attr($api.byId('demandMoney'), 'placeholder', '')

    $api.attr($api.byId('timeLimit'), 'disabled', true)
    $api.attr($api.byId('timeLimit'), 'placeholder', '')
  }

  __removeDisabled () { // 可编辑
    let buildType = Array.from(document.querySelectorAll('[name="buildType"]'))
    buildType.forEach(item => {
      $api.removeAttr(item, 'disabled')
    })
    $api.removeAttr($api.byId('agreement'), 'disabled')
    $api.removeAttr($api.byId('expectInveste'), 'disabled')
    $api.attr($api.byId('expectInveste'), 'placeholder', '请输入')

    $api.removeAttr($api.byId('demandMoney'), 'disabled')
    $api.attr($api.byId('demandMoney'), 'placeholder', '请输入')

    $api.removeAttr($api.byId('timeLimit'), 'disabled')
    $api.attr($api.byId('timeLimit'), 'placeholder', '请输入')
  }

  __initValidation () {
    const cfg = {
      agreement: {
        revert: false, // 不返回该字段，默认返回
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
        condition: () => { return this.__isShebeiDai() },
        get: function () {
          const checkedRadio = document.querySelector('[name="buildType"]:checked')
          return checkedRadio ? checkedRadio.value : ''
        }
      },
      expectInveste: {
        valid: {
          max: [9999, '建厂预计投入不能超过9999'],
        },
        condition: () => { return this.__isShebeiDai() },
        get: function () {
          return $api.byId('expectInveste').value
        }
      },
      demandMoney: {
        validator: (callback) => {
          let value = $api.byId('demandMoney').value.trim()
          if (!value) {
            callback('请填入需求资金')
          } else if (isNaN(value)) {
            callback('需求资金只能填入数字')
          } else {
            callback()
          }
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
        validator: (callback) => {
          let value = $api.byId('timeLimit').value.trim()
          if (!value) {
            callback('请输入用款期限')
          } else if (isNaN(value)) {
            callback('用款期限只能填入数字')
          } else {
            callback()
          }
        },
        get: function () {
          return $api.byId('timeLimit').value
        }
      },
    }
    return new Validation(cfg)
  }

  async __save () {
    const validation = this.__initValidation()
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

  showProtocol () {
    let node = getNodeProtocolFromStorage(4)
    if (!node) {
      api.toast({ msg: '协议不存在', location: 'middle' })
      return
    }
    let tpl = node.map(item => {
      return `<li tapmode="active" data-name="${item.protocolName}" data-id="${item.protocolFileId}">${item.protocolName}</li>`
    })
    $api.byId('protocol').innerHTML = tpl.join('')
  }

  bindEvent () {
    // 选填，客户录入（4位数）
    new NumberLimit($api.byId('expectInveste'))
    // 协议
    $api.byId('agreement').onchange = function (e) {
      let el = document.querySelector('#save')
      if ((e.target.checked)) {
        $api.removeAttr(el, 'disabled')
      } else {
        $api.attr(el, 'disabled', true)
      }
    }
    // 资金需求 可修改小额度
    // $api.byId('demandMoney').oninput = function (e) {
    //   console.log(e.target.value)
    // }
    // // 用款期限 可修改小额度
    // $api.byId('timeLimit').oninput = function (e) {
    //   console.log(e.target.value)
    // }
    // 保存
    document.querySelector('#save').onclick = () => {
      this.__save()
    }
    document.querySelector('#protocol').onclick = e => {
      let strong = $api.closest(e.target, 'li')
      if (strong) {
        openAgreement(strong.dataset.id, strong.dataset.name)
      }
    }
  }
}

apiready = function () {
  const ctrl = new PageController()
  ctrl.bindEvent()

  // 下拉刷新
  setRefreshHeaderInfo(function(ret, err) {
    ctrl.showProtocol()
    ctrl.getProduct()
  })
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  api.addEventListener({
    name:'viewappear'
  }, function(ret, err){
    ctrl.showProtocol()
    ctrl.getProduct()
  })

}
