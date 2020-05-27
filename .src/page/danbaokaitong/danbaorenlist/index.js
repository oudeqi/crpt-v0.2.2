import './index.css'
import { http, setRefreshHeaderInfo } from '../../../config'
import { openDanbaoRenForm } from '../../../webview.js'
import Utils from '../../../utils'

class Service {
  // 担保列表查询
  queryList (params) {
    return http.get('/crpt-guarantee/guarantor/counter/appinfolist/', {
      body: params
    })
  }
  // 发送担保人
  sendDanbaoren (params) {
    return http.post('/crpt-guarantee/guarantor/counter/sendout', {
      body: params
    })
  }
  // 保存
  saveDanbaoren (params) {
    return http.post('/crpt-guarantee/guarantor/counter/save', {
      body: params
    })
  }
}

class pageController extends Service {

  constructor() {
    super(...arguments)
    const { gtCreditId, gtId, productId, demandMoney } = api.pageParam || {}
    this.initData = {
      gtCreditId, // 担保授信id
      gtId, // 担保id
      productId, // 产品id
      demandMoney // 资金需求
    }
    this.category = {
      teacher: '教师',
      doctor: '医生',
      civilServant: '公务员',
      employeesSOE: '国企员工',
      individualBusiness: '个体经商',
      others: '其他',
    }
  }

  _renderList (key, arr) {
    const category = this.category
    const confirmed = arr.find(item => item.status === 3) || []
    const confirmedLength = confirmed.length
    const collapseBodyTpl = arr.map((item, index) => {
      let statusMap = {
        0: ['未填写信息', 'wait'],
        1: ['待发送', 'wait'],
        2: ['确认中', 'confirming'],
        3: ['已确认', 'confirmed'],
        4: ['已作废', 'disabled'],
        5: ['已签约', 'confirmed'],
        6: ['已拒签', 'disabled'] // ，默认为：0。
      }
      // <span class="del">删除</span>
      return `
        <li class="collapse-item">
          <label class="checkbox">
            <input ${item.status === 1 ? '' : 'disabled'} type="checkbox" data-id="${item.gtCounterId}" data-phone="${item.phone || ''}" checkbox-trigger="body">
            <span></span>
          </label>
          <div class="cont" click-trigger="item" data-id="${item.gtCounterId}" data-type="${key}">
            <span class="txt">担保人${index + 1}</span>
            <span data-status="${item.status}" class="tag ${statusMap[item.status] && statusMap[item.status][1]}">${statusMap[item.status] && statusMap[item.status][0]}</span>
          </div>
        </li>
      `
    })
    const collapseTpl = `
      <div class="collapse" collapse="show">
        <div class="collapse-header">
          <label class="checkbox">
            <input type="checkbox" checkbox-trigger="header">
            <span></span>
          </label>
          <div class="cont" click-trigger="header">
            <span>${category[key]}</span>
            <span>${confirmedLength}/${arr.length}人</span>
          </div>
        </div>
        <ul class="collapse-body" id="${key}-body">
          ${collapseBodyTpl.join('')}
        </ul>
      </div>
    `
    $api.byId(key).innerHTML = collapseTpl
  }

  async getPageDate () {
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      const res = await this.queryList(this.initData)
      if (res.code === 200) {
        for (key of Object.keys(res.data)) {
          this._renderList(key, res.data[key])
        }
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
    api.refreshHeaderLoadDone()
  }

  _resetAllCheckbox () {
    const body = document.querySelector('body')
    const allBodyCheckbox = $api.domAll(body, 'input[checkbox-trigger="body"]')
    let allChecked = Array.from(allBodyCheckbox).every(item => item.checked)
    $api.byId('allChecked').checked = allChecked
  }

  _resetParentcheckbox (current) {
    const collapse = $api.closest(current, '.collapse')
    const parent = $api.dom(collapse, '[checkbox-trigger="header"]')
    const allBodyCheckbox = $api.domAll(collapse, '[checkbox-trigger="body"]')
    let allChecked = Array.from(allBodyCheckbox).every(item => item.checked)
    parent.checked = allChecked
  }

  bindEvent () {
    // 折叠
    document.querySelector('body').addEventListener('click', e => {
      const header = $api.closest(event.target, '[click-trigger="header"]')
      if (header) {
        const collapse = $api.closest(event.target, '.collapse')
        if (collapse) {
          let visiable = $api.attr(collapse, 'collapse')
          if (visiable === 'show') {
            visiable = 'hide'
          } else {
            visiable = 'show'
          }
          $api.attr(collapse, 'collapse', visiable)
        }
      }
    })

    // 头部 checkbox ，控制 body的checkbox，allcheckbox
    document.querySelector('body').addEventListener('click', e => {
      const headerCheckbox = $api.closest(event.target, '[checkbox-trigger="header"]')
      if (headerCheckbox) {
        const collapse = $api.closest(event.target, '.collapse')
        const bodyCheckbox = $api.domAll(collapse, '[checkbox-trigger="body"]')
        for (key of Object.keys(bodyCheckbox)) {
          if (!bodyCheckbox[key].disabled) {
            bodyCheckbox[key].checked = headerCheckbox.checked
          }
        }
        this._resetAllCheckbox()
      }
    })

    // 底部 checkbox ，控制 header，body checkbox
    $api.byId('allChecked').onclick = (e) => {
      const bottomCheckbox = event.target
      const allBodyCheckbox = $api.domAll(document.querySelector('body'), '[checkbox-trigger="body"]')
      for (key of Object.keys(allBodyCheckbox)) {
        if (!allBodyCheckbox[key].disabled) {
          allBodyCheckbox[key].checked = bottomCheckbox.checked
        }
      }
      const allHeaderCheckbox = $api.domAll(document.querySelector('body'), '[checkbox-trigger="header"]')
      for (key of Object.keys(allHeaderCheckbox)) {
        allHeaderCheckbox[key].checked = bottomCheckbox.checked
      }
    }

    // 子 checkbox 控制parentcheckbox,allcheckbox
    document.querySelector('body').addEventListener('click', e => {
      const bodyCheckbox = $api.closest(event.target, '[checkbox-trigger="body"]')
      if (bodyCheckbox) {
        this._resetParentcheckbox(bodyCheckbox)
        this._resetAllCheckbox()
      }
    })

    // 添加其他
    document.querySelector('#add').onclick = () => {
      let othersBody = $api.byId('others-body')
      if (!othersBody) {
        const collapseTpl = `
          <div class="collapse" collapse="show">
            <div class="collapse-header">
              <label class="checkbox">
                <input type="checkbox" checkbox-trigger="header">
                <span></span>
              </label>
              <div class="cont" click-trigger="header">
                <span>其他</span>
                <span id="othersNum">0/0人</span>
              </div>
            </div>
            <ul class="collapse-body" id="others-body"></ul>
          </div>
        `
        $api.byId('others').innerHTML = collapseTpl
      }
      othersBody = $api.byId('others-body')
      let others = $api.domAll(othersBody, '.collapse-item')
      let length = Object.keys(others).length
      const tpl = `
      <li class="collapse-item">
        <label class="checkbox">
          <input type="checkbox" checkbox-trigger="body">
          <span></span>
        </label>
        <div class="cont" click-trigger="item" data-id="" data-type="others">
          <span class="txt">担保人${length + 1}</span>
          <span class="del" click-trigger="del">删除</span>
          <span class="tag wait">未填写信息</span>
        </div>
      </li>
      `
      $api.append(othersBody, tpl)
      $api.byId('othersNum').innerHTML = `0/${length + 1}人`
      this._resetParentcheckbox($api.dom(othersBody, '[checkbox-trigger="body"]'))
      this._resetAllCheckbox()
    }

    // 删除其他，去下一页
    document.querySelector('body').addEventListener('click', e => {
      // 删除其他
      if ($api.attr(event.target, 'click-trigger') === 'del') {
        const item = $api.closest(event.target, '.collapse-item')
        if (item) {
          $api.remove(item)
          const othersBody = $api.byId('others-body')
          const others = $api.domAll(othersBody, '.collapse-item')
          const length = Object.keys(others).length
          if (length > 0) {
            $api.byId('othersNum').innerHTML = `0/${length}人`
          }
          if (length === 0) {
            $api.byId('others').innerHTML = ''
          }
          this._resetParentcheckbox($api.dom(othersBody, '[checkbox-trigger="body"]'))
          this._resetAllCheckbox()
        }
      } else { // 去下一页
        const item = $api.closest(event.target, '[click-trigger="item"]')
        if (item) {
          openDanbaoRenForm({
            gtCreditId: this.initData.gtCreditId,
            gtCounterId: item.dataset.id,
            type: item.dataset.type,
          })
        }
      }
    })

  }

  async save () {
    const allTag = Array.from(document.querySelectorAll('.tag'))
    const allSigned = allTag.every(item => item.dataset.status === 5 || item.dataset.status === '5')
    if (!allSigned) {
      api.toast({ msg: '请确保所有的担保人已经签约', location: 'middle' })
      return
    }
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      const { gtCreditId, gtId } = this.initData
      let postData = { gtCreditId, gtId }
      const res = await this.saveDanbaoren(postData)
      if (res.code === 200) {
        api.toast({ msg: '保存成功', location: 'middle', global: true })
        Utils.Router.closeCurrentWinAndRefresh({
            winName: 'html/danbaostep2/index',
            script: 'window.location.reload();'
        })
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
  }

  async send () {
    const body = document.querySelector('body')
    const checked = Array.from($api.domAll(body, 'input[checkbox-trigger="body"]:checked'))
    if (checked.length === 0) {
      api.toast({ msg: '请至少选择一项', location: 'middle' })
    } else {
      let postData = []
      checked.forEach(item => {
        postData.push({
          gtCounterId: item.dataset.id,
          phone: item.dataset.phone,
          gtCreditId: this.initData.gtCreditId,
          gtId: this.initData.gtId,
        })
      })
      api.showProgress({ title: '加载中...', text: '', modal: false })
      try {
        const res = await this.sendDanbaoren(postData)
        if (res.code === 200) {
          api.toast({ msg: '短信发送成功', location: 'middle' })
          this.getPageDate()
        }
      } catch (error) {
        api.toast({ msg: error.msg || '出错啦', location: 'middle' })
      }
      api.hideProgress()
    }
  }
}

apiready = function () {

  const ctrl = new pageController()
  ctrl.bindEvent()
  ctrl.getPageDate()
  setRefreshHeaderInfo(function () {
    ctrl.getPageDate()
  })

  $api.byId('send').onclick = function () {
    ctrl.send()
  }

  $api.byId('save').onclick = function () {
    ctrl.save()
  }

  api.addEventListener({
    name: 'navitembtn'
  }, (ret, err) => {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  api.addEventListener({
    name:'viewappear'
  }, function(ret, err){
    ctrl.getPageDate()
  })

}
