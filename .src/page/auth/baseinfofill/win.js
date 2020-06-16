import '../../../app.css'
import './win.css'

import { openAuthResult, openCityList } from '../../../webview.js'
import { http, ActionSheet, CitySelector, isPhoneNo } from '../../../config.js'


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
        addrProvince: '', // String 是 法人居住地址（省）
        addrProvinceCode: '', // String 是 法人居住地址编号（省）
        addrCity: '', // String 是 法人居住地址（市）
        addrCityCode: '', // String 是 法人居住地址编号（市）
        addrCounty: '', // String 是 法人居住地址（区县）
        addrCountyCode: '', // String 是 法人居住地址编号（区县）
        relationship: '',
        // workCompany 工作单位 选填
        // animalHusbandryYear 行业年限
        // addrDetail 法人居住地址详细
        // relationName 姓名
        // relationPhone 手机号
        // otherName 姓名
        // otherPhone 手机号
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
    let label = '您'
    this.el.userType1.innerHTML = label
    this.el.userType2.innerHTML = label
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
    // api.addEventListener({
    //   name: 'cityListSelected'
    // }, (ret, err) => {
    //   const selected = ret.value
    //   console.log(JSON.stringify(selected))
    //   $api.dom($api.byId('permanentAddress'), 'input').value = selected.city
    //   this.state.postData.permanentAddress = selected.city
    // })
    // document.querySelector('#permanentAddress').onclick = () => {
    //   openCityList({ eventName: 'cityListSelected' })
    // }
    document.querySelector('#permanentAddress').onclick = () => {
      CitySelector(selected => {
        console.log(JSON.stringify(selected))
        let a = selected[0]
        let b = selected[1]
        let c = selected[2]
        let addr = `${a.name}/${b.name}/${c.name}`
        $api.dom($api.byId('permanentAddress'), 'input').value = addr
        this.state.postData.permanentAddress = addr
      })
    }

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

    // 亲属关系  标记  1-配偶 2-子女 3-父母
    document.querySelector('#relationship').onclick = () => {
      let btns = ['配偶', '子女', '父母']
      ActionSheet('请选择亲属关系', btns, (index) => {
        $api.dom($api.byId('relationship'), 'input').value = btns[index]
        this.state.postData.relationship = String(index + 1)
      })
    }

  }
  // 表单验证
  formValidation () {
    let workCompany = $api.byId('workCompany').value.trim()
    let animalHusbandryYear = $api.byId('animalHusbandryYear').value.trim()
    let addrDetail = $api.byId('addrDetail').value.trim()
    let relationName = $api.byId('relationName').value.trim()
    let relationPhone = $api.byId('relationPhone').value.trim()
    let otherName = $api.byId('otherName').value.trim()
    let otherPhone = $api.byId('otherPhone').value.trim()
    const { postData } = this.state
    let valid = true
    if (!postData.marriage) {
      api.toast({ msg: '请选择婚姻状况', location: 'middle' })
      valid = false
      return valid
    }
    if (!postData.isChildren) {
      api.toast({ msg: '请选择子女状况', location: 'middle' })
      valid = false
      return valid
    }
    if (!postData.education) {
      api.toast({ msg: '请选择教育情况', location: 'middle' })
      valid = false
      return valid
    }
    if (!postData.permanentAddress) {
      api.toast({ msg: '请选择户籍地址', location: 'middle' })
      valid = false
      return valid
    }
    if (!animalHusbandryYear) {
      api.toast({ msg: '请输入从事畜牧行业年限', location: 'middle' })
      valid = false
      return valid
    }
    if (isNaN(animalHusbandryYear)) {
      api.toast({ msg: '从事畜牧行业年限只能输入数字', location: 'middle' })
      valid = false
      return valid
    }
    if (!postData.addrProvince) {
      api.toast({ msg: '请选择居住地省市地区', location: 'middle' })
      valid = false
      return valid
    }
    if (!addrDetail) {
      api.toast({ msg: '请选择居住地详细地址', location: 'middle' })
      valid = false
      return valid
    }
    if (!postData.relationship) {
      api.toast({ msg: '请选择亲属关系', location: 'middle' })
      valid = false
      return valid
    }
    if (!relationName) {
      api.toast({ msg: '请输入直属亲属姓名', location: 'middle' })
      valid = false
      return valid
    }
    if (!relationPhone) {
      api.toast({ msg: '请输入直属亲属手机号', location: 'middle' })
      valid = false
      return valid
    }
    if (!isPhoneNo(relationPhone)) {
      api.toast({ msg: '直属亲属手机号格式不正确', location: 'middle' })
      valid = false
      return valid
    }
    if (!otherName) {
      api.toast({ msg: '请输入其他联系人姓名', location: 'middle' })
      valid = false
      return valid
    }
    if (!otherPhone) {
      api.toast({ msg: '请输入其他联系人手机号', location: 'middle' })
      valid = false
      return valid
    }
    if (!isPhoneNo(otherPhone)) {
      api.toast({ msg: '其他联系人手机号格式不正确', location: 'middle' })
      valid = false
      return valid
    }
    return valid
  }

  bindEvent () {
    // 返回
    api.addEventListener({
      name: 'navitembtn'
    }, function (ret, err) {
      if (ret.type === 'left') {
        api.closeWin()
      }
    })

    this.el.submit.onclick = () => {
      if (this.state.submitStatus === 'notsubmit') {
        if (!this.formValidation()) { return }
        this.state.submitStatus = 'submitting'
        $api.addCls(this.el.submit, 'loading')
        let workCompany = $api.byId('workCompany').value.trim()
        let animalHusbandryYear = $api.byId('animalHusbandryYear').value.trim()
        let addrDetail = $api.byId('addrDetail').value.trim()
        let relationName = $api.byId('relationName').value.trim()
        let relationPhone = $api.byId('relationPhone').value.trim()
        let otherName = $api.byId('otherName').value.trim()
        let otherPhone = $api.byId('otherPhone').value.trim()
        const data = {
          ...this.state.postData,
          workCompany,
          animalHusbandryYear,
          addrDetail,
          relationName,
          relationPhone,
          otherName,
          otherPhone,
        }
        this.submit(this.state.url, data).then(res => {
          if (res.code === 200) {
            this.state.submitStatus = 'notsubmit'
            $api.removeCls($api.byId('submit'), 'loading')
            openAuthResult({
              status: 'success',
              message: '补充基本信息成功',
              title: '补充基本信息'
            })
          }
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

  const ctrl = new PageController()
  ctrl.renderUserType()
  ctrl.initComputedState()
  ctrl.initForm()
  ctrl.bindEvent()

}
