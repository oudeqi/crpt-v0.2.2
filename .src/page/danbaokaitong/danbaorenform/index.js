import './index.css'
import '../form.css'

import { http, ActionSheet, CitySelector, getPicture, setRefreshHeaderInfo } from '../../../config'
import { openDanbaoRenForm, openCheliang, openFangchan } from '../../../webview.js'
import { Validation, NumberLimit } from '../form.js'
import BaiduSDK from '../../../utils/ocr/baidu'

const baidu = new BaiduSDK()

class Service {

  // 保存身份证图片
  saveIDCardPic(gtId, files) {
    return http.upload(
      '/crpt-guarantee/guarantor/attachment/save?gtId=' + gtId,
      {files},
      {
        headers: {},
        timeout: 3000
      }
    )
  }

  // 获取担保状态
  queryDanbaoStatus () {
    return http.get('/crpt-guarantee/gt/apply/query')
  }

  // 反担保人新增
  addDanbaoRen (params) {
    return http.post('/crpt-guarantee/guarantor/counter/insert', {
      body: params
    })
  }

  // 反担保人更新
  updateDanbaoRen (params) {
    return http.post('/crpt-guarantee/guarantor/counter/update', {
      body: params
    })
  }

  // 反担保人信息查询
  queryDanbaoRenMsgById (id) {
    return http.get('/crpt-guarantee/guarantor/counter/infoquery?id=' + id)
  }
}

class PageController extends Service {

  constructor() {
    super(...arguments)
    const { gtCreditId, gtCounterId, type, status } = api.pageParam || {}
    const typeMap = {
      teacher: 1, // '教师',
      doctor: 2, // '医生',
      civilServant: 3, // '公务员',
      employeesSOE: 4, // '国企员工',
      individualBusiness: 5, // '个体经商',
      others: 6, // '其他',
    }
    this.initData = {
      // gtId	int	担保申请id
      // gtCreditId	int	担保授信id
      gtCreditId, // 担保授信id
      gtCounterId, // 担保人id
      type: typeMap[type],
      status, // status 反担保人状态
      // 0：未填写信息   1：待发送  2：确认中  3：已确认   4：已作废  5：已签约  6：已拒签  ，默认为：0。

    }
    // 1： 配偶、 2：父母、 3：同事、 4：朋友、 5：亲戚
    this.relationship = ['配偶', '父母', '同事', '朋友', '亲戚']
    // 婚姻状况 1：未婚  :2：已婚、  3：已婚有子女、  4：离异后未再婚
    this.marriage = ['未婚', '已婚', '已婚有子女', '离异后未再婚']
    // 【本科及以上、大专、中专或高中、初中或以下】
    this.education = ['本科及以上', '大专', '中专或高中', '初中或以下']
  }

  __pageDataFillBack (data) {
    $api.byId('name').value = data.name || ''
    $api.byId('phone').value = data.phone || ''
    $api.byId('spousePhone').value = data.spousePhone || ''
    const certNo = $api.byId('certNo')
    certNo.value = data.certNo || ''
    certNo.dataset.picture = data.pictureId || '' // 身份证图片地址

    const relationship = $api.byId('relationship')
    relationship.value = this.relationship[(parseInt(data.relationship) || 100) - 1] || ''
    relationship.dataset.value = data.relationship || '' // 与借款人关系 1： 配偶、 2：父母、 3：同事、 4：朋友、 5：亲戚

    const marriage = $api.byId('marriage')
    marriage.value = this.marriage[(parseInt(data.marriage) || 100) - 1] || ''
    marriage.dataset.value = data.marriage || '' // 婚姻状况 1：未婚  :2：已婚、  3：已婚有子女、  4：离异后未再婚

    const education = $api.byId('education')
    education.value = data.education || ''
    education.dataset.value = data.education || '' // 学历
    const checkedAccountNature = document.querySelector(`[name="accountNature"][value="${data.accountNature}"]`)
    if (checkedAccountNature) {
      checkedAccountNature.checked = true // 户口性质 1：常住户、  2：临时户
    }

    const address = $api.byId('address')
    const workAddress = $api.byId('workAddress')
    address.value = data.addrProvince ? `${data.addrProvince}/${data.addrCity}/${data.addrCounty}` : ''
    address.dataset.province = data.addrProvince || '' // 常住地址（省）
    address.dataset.provinceCode = data.addrProvinceCode || '' // 常住地址编号（省）
    address.dataset.city = data.addrCity || '' // 常住地址（市）
    address.dataset.cityCode = data.addrCityCode || '' // 常住地址编号（市）
    address.dataset.county = data.addrCounty || '' // 常住地址（区县）
    address.dataset.countyCode = data.addrCountyCode || '' //  常住地址编号（区县）
    $api.byId('addrDetail').value = data.addrDetail || '' // 常住地址详细

    workAddress.value = data.workAddrProvince ? `${data.workAddrProvince}/${data.workAddrCity}/${data.workAddrCounty}` : ''
    workAddress.dataset.province = data.workAddrProvince || '' // 工作地址（省）
    workAddress.dataset.provinceCode = data.workAddrProvinceCode || '' // 工作地址编号（省）
    workAddress.dataset.city = data.workAddrCity || '' // 工作地址（市）
    workAddress.dataset.cityCode = data.workAddrCityCode || '' // 工作地址编号（市）
    workAddress.dataset.county = data.workAddrCounty || '' // 工作地址（区县）
    workAddress.dataset.countyCode = data.workAddrCountyCode || '' // 工作地址编号（区县）
    $api.byId('workAddrDetail').value = data.workAddrDetail || '' // 工作地址详细

    $api.byId('occupation').value = data.occupation || '' //  职业
    $api.byId('bankName').value = data.bankName || '' // 银行名称
    $api.byId('bankCardNo').value = data.bankCardNo || '' // 银行卡号
    $api.byId('openBank').value = data.openBank || '' // 开户行
    $api.byId('spouseName').value = data.spouseName || '' // 配偶姓名
    $api.byId('spouseIncome').value = data.spouseIncome || '' // 配偶年收入  单位为: 万元
    $api.byId('spouseOccupation').value = data.spouseOccupation || '' // 配偶职业
    $api.byId('spouseWorkCompany').value = data.spouseWorkCompany || '' // 配偶工作单位
    // 是否填写车辆信息 1. 未填写  3. 已填写
    // 是否填写房产信息 1. 未填写  3. 已填写
    this.__renderFillStatus(data.carFillStatus, data.houseFillStatus)
  }

  __renderFillStatus (carFillStatus, houseFillStatus) {
    const cheliangEl = $api.byId('cheliang')
    const fangchanEl = $api.byId('fangchan')
    if (carFillStatus === 3 || carFillStatus === '3') {
      $api.addCls(cheliangEl, 'ok')
    } else {
      $api.removeCls(cheliangEl, 'ok')
    }
    if (houseFillStatus === 3 || houseFillStatus === '3') {
      $api.addCls(fangchanEl, 'ok')
    } else {
      $api.removeCls(fangchanEl, 'ok')
    }
  }

  __initValidation () {
    const cfg = {
      name: {
        valid: {
          required: '请输入担保人姓名'
        },
        get: function () {
          return $api.byId('name').value
        }
      },
      phone: {
        valid: {
          required: '请输入担保人联系电话',
          pattern: [/^1[3456789]\d{9}$/, '手机号码格式不正确'],
        },
        get: function () {
          return $api.byId('phone').value
        }
      },
      certNo: {
        valid: {
          pattern: [/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, '身份证号码格式不正确'],
        },
        get: function () {
          return $api.byId('certNo').value
        }
      },
      spousePhone: { // 配偶电话
        valid: {
          pattern: [/^1[3456789]\d{9}$/, '配偶电话号码格式不正确'],
        },
        get: function () {
          return $api.byId('spousePhone').value
        }
      }
    }
    return new Validation(cfg)
  }

  __bindNavBtnEvent () {
    api.addEventListener({
      name: 'navitembtn'
    }, (ret, err) => {
      console.log(JSON.stringify(ret))
      if (ret.type === 'left') {
        api.closeWin()
      }
    })
  }

  __bindCollapseEvent () {
    $api.byId('collapse').onclick = e => {
      const collapse = $api.closest(event.target, '.collapse')
      let visiable = $api.attr(collapse, 'collapse')
      if (visiable === 'show') {
        visiable = 'hide'
      } else {
        visiable = 'show'
      }
      $api.attr(collapse, 'collapse', visiable)
    }
  }

  __bindGoFangchanAndCheliang () {
    $api.byId('fangchan').onclick = () => {
      this.queryDanbaoStatus().then(res => {
        if (res.code === 200) {
          // gtId	int	担保申请id
          // gtCreditId	int	担保授信id
          // flowStatus: props.pageParam.flowStatus, 资料录入状态
          // 0 无填写 1	int	担保业务申请填写 2	int	反担保人列表 3	int	文书送达地址 4	int	其他附件上传
          // type: props.pageParam.type, 反担保人传 2
          // gtCounterId: props.pageParam.gtCounterId, 担保人id
          // _cb: props.pageParam._cb, 字符串的回调函数
          const {gtId, flowStatus, gtCreditId} = res.data || {}
          const { gtCounterId } = this.initData
          openFangchan({
            gtId,
            flowStatus,
            gtCreditId,
            gtCounterId,
            type: 2,
            _cb: 'location.reload();'
          })
        }
      }).catch(error => {
        api.toast({ msg: error.msg || '出错啦', location: 'middle' })
      })
    }
    $api.byId('cheliang').onclick = () => {
      this.queryDanbaoStatus().then(res => {
        if (res.code === 200) {
          const {gtId, flowStatus, gtCreditId} = res.data || {}
          const { gtCounterId } = this.initData
          openCheliang({
            gtId,
            flowStatus,
            gtCreditId,
            gtCounterId,
            type: 2,
            _cb: 'location.reload();'
          })
        }
      }).catch(error => {
        api.toast({ msg: error.msg || '出错啦', location: 'middle' })
      })
    }
  }

  __getOtherParams () {
    const accountNature = document.querySelector('[name="accountNature"]:checked')
    const address = $api.byId('address')
    const workAddress = $api.byId('workAddress')
    let params = {
      pictureId: $api.byId('certNo').dataset.picture, // 身份证图片地址
      relationship: $api.byId('relationship').dataset.value, // 与借款人关系 1： 配偶、 2：父母、 3：同事、 4：朋友、 5：亲戚
      marriage: $api.byId('marriage').dataset.value, // 婚姻状况 1：未婚  :2：已婚、  3：已婚有子女、  4：离异后未再婚
      education: $api.byId('education').dataset.value, // 学历
      accountNature: accountNature ? accountNature.value : '', // 户口性质 1：常住户、  2：临时户

      addrProvince: address.dataset.province, // 常住地址（省）
      addrProvinceCode: address.dataset.provinceCode, // 常住地址编号（省）
      addrCity: address.dataset.city, // 常住地址（市）
      addrCityCode: address.dataset.cityCode, // 常住地址编号（市）
      addrCounty: address.dataset.county, // 常住地址（区县）
      addrCountyCode: address.dataset.countyCode, //  常住地址编号（区县）
      addrDetail: $api.byId('addrDetail').value, // 常住地址详细

      workAddrProvince: workAddress.dataset.province, // 工作地址（省）
      workAddrProvinceCode: workAddress.dataset.provinceCode, // 工作地址编号（省）
      workAddrCity: workAddress.dataset.city, // 工作地址（市）
      workAddrCityCode: workAddress.dataset.cityCode, // 工作地址编号（市）
      workAddrCounty: workAddress.dataset.county, // 工作地址（区县）
      workAddrCountyCode: workAddress.dataset.countyCode, // 工作地址编号（区县）
      workAddrDetail: $api.byId('workAddrDetail').value, // 工作地址详细

      occupation: $api.byId('occupation').value, //  职业
      bankName: $api.byId('bankName').value, // 银行名称
      bankCardNo: $api.byId('bankCardNo').value, // 银行卡号
      openBank: $api.byId('openBank').value, // 开户行
      spouseName: $api.byId('spouseName').value, // 配偶姓名
      spouseIncome: $api.byId('spouseIncome').value, // 配偶年收入  单位为: 万元
      spouseOccupation: $api.byId('spouseOccupation').value, // 配偶职业
      spouseWorkCompany: $api.byId('spouseWorkCompany').value, // 配偶工作单位
    }
    return params
  }

  __InitRelationship () {
    $api.byId('relationship').onclick = (e) => {
      ActionSheet('与借款人关系', this.relationship, (index) => {
        e.target.value = this.relationship[index]
        e.target.dataset.value = index + 1
      })
    }
  }

  __InitMarriage () {
    $api.byId('marriage').onclick = (e) => {
      ActionSheet('婚姻状况', this.marriage, (index) => {
        e.target.value = this.marriage[index]
        e.target.dataset.value = index + 1
      })
    }
  }

  __InitEducation () {
    $api.byId('education').onclick = (e) => {
      ActionSheet('请选择学历', this.education, (index) => {
        e.target.value = this.education[index]
        e.target.dataset.value = this.education[index]
      })
    }
  }

  __initAddress () {
    $api.byId('address').onclick = (e) => {
      CitySelector(selected => {
        console.log(JSON.stringify(selected))
        let a = selected[0]
        let b = selected[1]
        let c = selected[2]
        e.target.value = `${a.name}/${b.name}/${c.name}`
        e.target.dataset.province = a.name
        e.target.dataset.provinceCode = a.id
        e.target.dataset.city = b.name
        e.target.dataset.cityCode = b.id
        e.target.dataset.county  = c.name
        e.target.dataset.countyCode = c.id
      })
    }
  }

  __initWorkAddress () {
    $api.byId('workAddress').onclick = (e) => {
      CitySelector(selected => {
        console.log(JSON.stringify(selected))
        let a = selected[0]
        let b = selected[1]
        let c = selected[2]
        e.target.value = `${a.name}/${b.name}/${c.name}`
        e.target.dataset.province = a.name
        e.target.dataset.provinceCode = a.id
        e.target.dataset.city = b.name
        e.target.dataset.cityCode = b.id
        e.target.dataset.county  = c.name
        e.target.dataset.countyCode = c.id
      })
    }
  }

  async __readIDCard (pic) {
    api.showProgress({ title: '识别中...', text: '' })
    try {
      const res = await baidu.IdcardVerify({certFile: pic})
      const res2 = await this.saveIDCardPic(this.initData.gtCreditId, { pictureFile: pic })
      if (res.code === 200 && res2.code === 200) {
        $api.byId('certNo').value = res.data.number || ''
        $api.byId('certNo').dataset.picture = res2.data.pictureId || ''
        api.toast({ msg: '识别成功', location: 'middle' })
      }
    } catch (error) {
      $api.byId('certNo').value = ''
      $api.byId('certNo').dataset.picture = ''
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
  }

  async __bindIDCardOcr () {
    $api.byId('idCardOcrBtn').onclick = () => {
      let btns = ['相机', '相册']
      let sourceType = ''
      ActionSheet('请选择', btns, index => {
        if (index === 0) {
          sourceType = 'camera'
        } else {
          sourceType = 'album'
        }
        getPicture(sourceType, async (ret, err) => {
          if (ret) {
            this.__readIDCard(ret.data)
          }
        })
      })
    }
  }

  async __readBank (pic) {
    api.showProgress({ title: '识别中...', text: '' })
    try {
      const res = await baidu.BankVerify({bankcardFile: pic})
      if (res.code === 200) {
        $api.byId('bankCardNo').value = res.data.bank_card_number || ''
        $api.byId('bankName').value = res.data.bank_name || ''
        api.toast({ msg: '识别成功', location: 'middle' })
      }
    } catch (error) {
      $api.byId('bankCardNo').value = ''
      $api.byId('bankName').value = ''
      api.toast({ msg: error.message || '出错啦', location: 'middle' })
    }
    api.hideProgress()
  }

  async __bindBankOcr () {
    $api.byId('bankOcrBtn').onclick = () => {
      let btns = ['相机', '相册']
      let sourceType = ''
      ActionSheet('请选择', btns, index => {
        if (index === 0) {
          sourceType = 'camera'
        } else {
          sourceType = 'album'
        }
        getPicture(sourceType, (ret, err) => {
          if (ret) {
            this.__readBank(ret.data)
          }
        })
      })
    }
  }

  initForm () {
    this.__InitRelationship()
    this.__InitMarriage()
    this.__InitEducation()
    this.__initAddress()
    this.__initWorkAddress()
  }

  bindEvent () {
    this.__bindNavBtnEvent()
    this.__bindCollapseEvent()
    this.__bindGoFangchanAndCheliang()
    this.__bindIDCardOcr()
    this.__bindBankOcr()
  }

  async getPageDate () {
    const btnEl = $api.byId('submit')
    $api.attr(btnEl, 'disabled', true)
    const gtCounterId = this.initData.gtCounterId
    if (!gtCounterId) {
      api.refreshHeaderLoadDone()
      return false
    }
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      const res = await this.queryDanbaoRenMsgById(gtCounterId)
      if (res.code === 200) {
        this.__pageDataFillBack(res.data)
        $api.removeAttr(btnEl, 'disabled')
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
    api.refreshHeaderLoadDone()
  }

  submit () {
    let status = parseInt(this.initData.status)
    if (!isNaN(status) && status >=3) {
      api.toast({ msg: '担保人状态为已经确认', location: 'middle' })
      return
    }
    if ($api.attr($api.byId('submit'), 'disabled')) {
      return
    }
    this.__initValidation().validate({
      error: function (msg) {
        api.toast({ msg, location: 'middle' })
      },
      success: async (data) => {
        try {
          const { gtCreditId, gtCounterId, type } = this.initData
          const isUpdate = gtCounterId
          const postData = {
            ...data,
            ...this.__getOtherParams(),
            type,
            gtCreditId, // 担保授信id
          }
          let callMethod = ''
          if (isUpdate) {
            callMethod = 'updateDanbaoRen'
            postData.gtCounterId = gtCounterId // 反担保人id
          } else {
            callMethod = 'addDanbaoRen'
            postData.responseLimitTime = 3 // 担保人响应时效 1：6小时 2：12 小时3：24小时，默认为： 3：24小时
            postData.isNecessary = 0 // 是否必输： 1-是  0-否，默认： 0-否
          }
          const res = await this[callMethod](postData)
          if (res && res.code === 200) {
            if (isUpdate) {
              api.toast({ msg: '更新担保人成功', location: 'middle', global: true})
            } else {
              this.initData.gtCounterId = res.data.gtCounterId
              api.toast({ msg: '新增担保人成功', location: 'middle', global: true})
            }
            api.closeWin()
          }
        } catch (error) {
          api.toast({ msg: error.msg, location: 'middle' })
        }
      }
    })
  }

}

apiready = function () {

  new NumberLimit($api.byId('spouseIncome')) // 限制配偶年收入输入
  const ctrl = new PageController()
  ctrl.bindEvent()
  ctrl.initForm()

  api.addEventListener({
    name:'viewappear'
  }, function(ret, err){
    ctrl.getPageDate()
  })
  setRefreshHeaderInfo(function () {
    ctrl.getPageDate()
  })
  $api.byId('submit').onclick = function () {
    ctrl.submit()
  }

}
