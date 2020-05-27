import '../../../app.css'
import './win.css'

import { openAuthResult, openCityList } from '../../../webview.js'
import { http, ActionSheet, CitySelector, initUIInput, isPhoneNo } from '../../../config.js'


class Service {
  submit (url, data) {
    return http.post(url, { body: data })
  }
}


class PageController extends Service {
  constructor () {
    super(...arguments)
    this.state = {
      userinfo: $api.getStorage('userinfo'),
      custType: ($api.getStorage('userinfo') || {}).custType,
      userType: ($api.getStorage('userinfo') || {}).userType,
      url: '',
      submitStatus: 'notsubmit', // notsubmit:未提交,submitting:正在提交
      postData: {
        marriage: '',
        isChildren: '',
        education: '',
        permanentAddress: '',
        workCompany: '', // 工作单位 选填
        animalHusbandryYear: '', // 从事畜牧<br />行业年限
        addrProvince: '', // String 是 法人居住地址（省）
        addrProvinceCode: '', // String 是 法人居住地址编号（省）
        addrCity: '', // String 是 法人居住地址（市）
        addrCityCode: '', // String 是 法人居住地址编号（市）
        addrCounty: '', // String 是 法人居住地址（区县）
        addrCountyCode: '', // String 是 法人居住地址编号（区县）
        addrDetail: '', // String 是 法人居住地址详细
        relationship: '',
        relationName: '',
        relationPhone: '',
        otherName: '',
        otherPhone: '',
      }
    }
    this.el = {
      userType1: $api.byId('userType1'),
      userType2: $api.byId('userType2'),
      submit: $api.byId('submit'),
    }
  }
  // 初始化计算属性
  initComputedState () {
    // 个人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/personinfo/submission
    // 企业法人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/legalinfo/submission
    if (this.state.userType === '1') {
      this.state.url = '/crpt-cust/saas/personinfo/submission'
    } else {
      this.state.url = '/crpt-cust/saas/legalinfo/submission'
    }
  }
  // 判断客户类型
  renderUserType () {
    if (this.state.userType === '1') {
      this.el.userType1.innerHTML = '个人'
      this.el.userType2.innerHTML = '个人'
    } else {
      this.el.userType1.innerHTML = '法定代表人'
      this.el.userType2.innerHTML = '法定代表人'
    }
  }
  // 初始化表单
  initForm () {
    // 婚姻状况 1：已婚   2：未婚 3：离异
    document.querySelector('#marriage').onclick = () => {
      let btns = ['已婚', '未婚', '离异 ']
      ActionSheet('请选择婚姻状况', btns, (index) => {
        $api.dom($api.byId('marriage'), 'input').value = btns[index]
        this.state.postData.marriage = String(index + 1)
      })
    }
    // 子女状况  0：无子女 1：有子女
    document.querySelector('#isChildren').onclick = () => {
      let btns = ['无子女', '有子女']
      ActionSheet('请选择子女状况', btns, (index) => {
        $api.dom($api.byId('isChildren'), 'input').value = btns[index]
        this.state.postData.isChildren = String(index)
      })
    }
    // 教育情况 ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学']
    document.querySelector('#education').onclick = () => {
      let btns = ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学']
      ActionSheet('请选择教育情况', btns, (index) => {
        $api.dom($api.byId('education'), 'input').value = btns[index]
        this.state.postData.education = btns[index]
      })
    }
    // 户籍地址
    api.addEventListener({
      name: 'cityListSelected'
    }, (ret, err) => {
      const selected = ret.value
      console.log(JSON.stringify(selected))
      $api.dom($api.byId('permanentAddress'), 'input').value = selected.city
      this.state.postData.permanentAddress = selected.city
    })
    document.querySelector('#permanentAddress').onclick = () => {
      openCityList({
        eventName: 'cityListSelected'
      })
    }
    // 工作单位 workCompany
    initUIInput($api.byId('workCompany'), {
      placeholder: '请输入',
      keyboardType: 'next',
      maxStringLength: 10
    }, (value) => {
      this.state.postData.workCompany = value
    })
    // 行业年限 animalHusbandryYear
    initUIInput($api.byId('animalHusbandryYear'), {
      placeholder: '请输入',
      keyboardType: 'number',
      maxStringLength: 2
    }, (value) => {
      this.state.postData.animalHusbandryYear = value
    })
    // 现居住信息
    document.querySelector('#address').onclick = () => {
      CitySelector(selected => {
        console.log(JSON.stringify(selected))
        let a = selected[0]
        let b = selected[1]
        let c = selected[2]
        $api.dom($api.byId('address'), 'input').value = `${a.name}/${b.name}/${c.name}`
        this.state.postData.addrProvince = a.name
        this.state.postData.addrProvinceCode = a.id
        this.state.postData.addrCity = b.name
        this.state.postData.addrCityCode = b.id
        this.state.postData.addrCounty = c.name
        this.state.postData.addrCountyCode = c.id
      })
    }
    // 详细地址
    initUIInput($api.byId('addrDetail'), {
      placeholder: '请输入',
      keyboardType: 'next',
      maxStringLength: 30
    }, (value) => {
      this.state.postData.addrDetail = value
    })
    // 亲属关系  标记  1-配偶 2-子女 3-父母
    document.querySelector('#relationship').onclick = () => {
      let btns = ['配偶', '子女', '父母']
      ActionSheet('请选择亲属关系', btns, (index) => {
        $api.dom($api.byId('relationship'), 'input').value = btns[index]
        this.state.postData.relationship = String(index + 1)
      })
    }
    // 姓名
    initUIInput($api.byId('relationName'), {
      placeholder: '请输入',
      keyboardType: 'next',
      maxStringLength: 10
    }, (value) => {
      this.state.postData.relationName = value
    })
    // 手机号
    initUIInput($api.byId('relationPhone'), {
      placeholder: '请输入',
      keyboardType: 'number',
      maxStringLength: 11
    }, (value) => {
      this.state.postData.relationPhone = value
    })
    // 姓名
    initUIInput($api.byId('otherName'), {
      placeholder: '请输入',
      keyboardType: 'next',
      maxStringLength: 10
    }, (value) => {
      this.state.postData.otherName = value
    })
    // 手机号
    initUIInput($api.byId('otherPhone'), {
      placeholder: '请输入',
      keyboardType: 'number',
      maxStringLength: 11
    }, (value) => {
      this.state.postData.otherPhone = value
    })
  }
  // 表单验证
  formValidation () {
    const { postData } = this.state
    let valid = true
    if (!postData.marriage) {
      api.toast({ msg: '请选择婚姻状况' })
      valid = false
      return valid
    }
    if (!postData.isChildren) {
      api.toast({ msg: '请选择子女状况' })
      valid = false
      return valid
    }
    if (!postData.education) {
      api.toast({ msg: '请选择教育情况' })
      valid = false
      return valid
    }
    if (!postData.permanentAddress) {
      api.toast({ msg: '请选择户籍地址' })
      valid = false
      return valid
    }
    if (!postData.animalHusbandryYear) {
      api.toast({ msg: '请输入从事畜牧行业年限' })
      valid = false
      return valid
    }
    if (!postData.addrProvince) {
      api.toast({ msg: '请选择居住地省市地区' })
      valid = false
      return valid
    }
    if (!postData.addrDetail) {
      api.toast({ msg: '请选择居住地详细地址' })
      valid = false
      return valid
    }
    if (!postData.relationship) {
      api.toast({ msg: '请选择亲属关系' })
      valid = false
      return valid
    }
    if (!postData.relationName) {
      api.toast({ msg: '请输入直属亲属姓名' })
      valid = false
      return valid
    }
    if (!postData.relationPhone) {
      api.toast({ msg: '请输入直属亲属手机号' })
      valid = false
      return valid
    }
    if (!isPhoneNo(postData.relationPhone)) {
      api.toast({ msg: '直属亲属手机号格式不正确' })
      valid = false
      return valid
    }
    if (!postData.otherName) {
      api.toast({ msg: '请输入其他联系人姓名' })
      valid = false
      return valid
    }
    if (!postData.otherPhone) {
      api.toast({ msg: '请输入其他联系人手机号' })
      valid = false
      return valid
    }
    if (!isPhoneNo(postData.otherPhone)) {
      api.toast({ msg: '其他联系人手机号格式不正确' })
      valid = false
      return valid
    }
    return valid
  }
  // 事件绑定
  bindEvent () {
    this.el.submit.onclick = () => {
      if (this.state.submitStatus === 'notsubmit') {
        if (!this.formValidation()) {
          return
        }
        this.state.submitStatus = 'submitting'
        $api.addCls(this.el.submit, 'loading')
        this.submit(this.state.url, this.state.postData).then(ret => {
          this.state.submitStatus = 'notsubmit'
          $api.removeCls($api.byId('submit'), 'loading')
            openAuthResult('success', '补充基本信息成功', '补充基本信息')
        }).catch(error => {
          api.toast({
            msg: error.msg || '提交失败',
            location: 'middle'
          })
          this.state.submitStatus = 'notsubmit'
          $api.removeCls($api.byId('submit'), 'loading')
        })
      }
    }
  }
}

apiready = function () {
  const controller = new PageController()
  controller.renderUserType()
  controller.initComputedState()
  controller.initForm()
  controller.bindEvent()



}
