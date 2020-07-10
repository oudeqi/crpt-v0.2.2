import '../../../app.css'
import './win.css'

import filterDict from '../../../utils/dict_filter/filter.js'
import { openAuthResult } from '../../../webview.js'
import { ActionSheet, CitySelector, isPhoneNo, isIdCardNo } from '../../../config.js'
import http from '../../../http'

class Service {
  submit (url, data) {
    return http.post(url, { body: data })
  }
}

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        service: new Service(),
        userinfo: $api.getStorage('userinfo'),
        urlMap: {
          1: '/crpt-cust/saas/personinfo/submission',
          2: '/crpt-cust/saas/legalinfo/submission',
        },
        marriageMap: {}, // {"10":"未婚","20":"已婚","21":"初婚","22":"再婚","23":"复婚","30":"丧偶","40":"离婚","90":"未说明的婚姻状况"}
        educationMap: {}, // 学历 {"10":"研究生","20":"大学本科","30":"大学专科或专科学校","40":"中等专业学校或中等技术学校","50":"技术学校","60":"高中","70":"初中","80":"小学","90":"文盲或半文盲","99":"未知"}
        academicDegreeMap: {}, // 学位 {"0":"其他","1":"名誉博士","2":"博士","3":"硕士","4":"学士","9":"未知"}
        livingConditionsMap: {}, // 居住状况 {"1":"自置","2":"按揭","3":"亲属楼宇","4":"集体宿舍","5":"租房","6":"共有住宅","7":"其他","9":"未知"}
        isPeasantMap: {}, // 是否为农户 {"0":"否","1":"是"}
        relationshipMap: {}, // {"1":"配偶","2":"子女","3":"父母","4":"其他"}
        loading: false,
        postData: {
          marriage: '', // 传code
          isChildren: '', // 子女情况  标志  1：有子女  0：无子女
          education: '', // 传学历字符串
          educationCode: '', // 传学历code
          academicDegree: '', // 传学位
          academicDegreeCode: '', // 传学位code
          
          addrProvince: '', // String 是 法人居住地址（省）
          addrProvinceCode: '', // String 是 法人居住地址编号（省）
          addrCity: '', // String 是 法人居住地址（市）
          addrCityCode: '', // String 是 法人居住地址编号（市）
          addrCounty: '', // String 是 法人居住地址（区县）
          addrCountyCode: '', // String 是 法人居住地址编号（区县）
          addrDetail: '', // 法人居住地址详细
          livingConditions: '', // 居住状况,传code
          permanentAddress: '', // 户籍地址，传字符串
          workCompany: '', // 工作单位 选填
          animalHusbandryYear: '', // 行业年限

          isPeasant: '', // 是否为农户  1：是   0：否
          relationship: '', // 注：20 已婚 21 初婚 22 再婚 23 复婚 这四种情况亲属关系直接为配偶，不让用户选择
          relationName: '', // 姓名
          relationPhone: '', // 手机号
          idNumber: '', // 亲属身份证号码
          otherName: '', // 其他联系人_姓名
          otherPhone: '', // 其他联系人_手机号
        }
      }
    },
    computed: {
      custType: function () {
        return this.userinfo.custType
      },
      userType: function () {
        return this.userinfo.userType
      },
      url: function () {
        return this.urlMap[this.userType]
      },
      marriage: function () {
        return this.postData.marriage
      }
    },
    watch: {
      marriage: function (newValue) {
        if (['20','21','22','23'].includes(String(newValue))) {
          // {"1":"配偶","2":"子女","3":"父母","4":"其他"}
          // 20 已婚 21 初婚 22 再婚 23 复婚 这四种情况亲属关系直接为配偶，不让用户选择
          if (String(this.postData.relationship) !== '1') {
            this.postData.relationship = '1'
            $api.dom($api.byId('relationship'), 'input').value = '配偶'
            this.postData.relationName = ''
            this.postData.relationPhone = ''
            this.postData.idNumber = ''
            api.alert({
              title: '提示',
              msg: `婚姻状况为已婚、初婚、再婚、复婚时亲属关系只能选择配偶`,
            })
          }
        }
      }
    },
    mounted: function () {
      this.getPageData()
    },
    methods: {

      async getPageData () {
        api.showProgress({ title: '加载中...', text: '', modal: false })
        this.marriageMap = await filterDict('custMarriage')
        this.educationMap = await filterDict('custEducation')
        this.academicDegreeMap = await filterDict('custAcademicDegree')
        this.livingConditionsMap = await filterDict('livingConditions')
        this.isPeasantMap = await filterDict('custIsPeasant')
        this.relationshipMap = await filterDict('relationship')
        api.hideProgress()
      },

      handleMarriageClick () {
        let marriageKeys = Object.keys(this.marriageMap)
        let marriageValues = Object.values(this.marriageMap)
        ActionSheet('请选择婚姻状况', marriageValues, (index) => {
          this.postData.marriage = marriageKeys[index]
          $api.dom($api.byId('marriage'), 'input').value = marriageValues[index]
        })
      },

      handleChildrenClick () {
        let btns = ['无子女', '有子女']
        ActionSheet('请选择子女状况', btns, (index) => {
          $api.dom($api.byId('isChildren'), 'input').value = btns[index]
          this.postData.isChildren = String(index)
        })
      },

      handleEducationClick () {
        let educationKeys = Object.keys(this.educationMap)
        let educationValues = Object.values(this.educationMap)
        ActionSheet('请选择学历情况', educationValues, (index) => {
          $api.dom($api.byId('education'), 'input').value = educationValues[index]
          this.postData.education = educationValues[index]
          this.postData.educationCode = educationKeys[index]
        })
      },

      handleAcademicDegreeClick () {
        let academicDegreeKeys = Object.keys(this.academicDegreeMap)
        let academicDegreeValues = Object.values(this.academicDegreeMap)
        ActionSheet('请选择学位情况', academicDegreeValues, (index) => {
          $api.dom($api.byId('academicDegree'), 'input').value = academicDegreeValues[index]
          this.postData.academicDegree = academicDegreeValues[index]
          this.postData.academicDegreeCode = academicDegreeKeys[index]
        })
      },

      handlePermanentAddressClick () {
        CitySelector(selected => {
          let a = selected[0]
          let b = selected[1]
          let c = selected[2]
          let addr = `${a.name}/${b.name}/${c.name}`
          $api.dom($api.byId('permanentAddress'), 'input').value = addr
          this.postData.permanentAddress = addr
        })
      },

      handleIsPeasantClick () {
        let isPeasantKeys = Object.keys(this.isPeasantMap)
        let isPeasantValues = Object.values(this.isPeasantMap)
        ActionSheet('是否为农户', isPeasantValues, (index) => {
          this.postData.isPeasant = isPeasantKeys[index]
          $api.dom($api.byId('isPeasant'), 'input').value = isPeasantValues[index]
        })
      },

      handleAddressClick () {
        CitySelector(selected => {
          let a = selected[0]
          let b = selected[1]
          let c = selected[2]
          $api.dom($api.byId('address'), 'input').value = `${a.name}/${b.name}/${c.name}`
          this.postData.addrProvince = a.name
          this.postData.addrProvinceCode = a.id
          this.postData.addrCity = b.name
          this.postData.addrCityCode = b.id
          this.postData.addrCounty = c.name
          this.postData.addrCountyCode = c.id
        })
      },

      handleLivingConditionsClick () {
        let livingConditionsKeys = Object.keys(this.livingConditionsMap)
        let livingConditionsValues = Object.values(this.livingConditionsMap)
        ActionSheet('请选择居住状况', livingConditionsValues, (index) => {
          this.postData.livingConditions = livingConditionsKeys[index]
          $api.dom($api.byId('livingConditions'), 'input').value = livingConditionsValues[index]
        })
      },

      handleRelationshipClick () {
        if (['20','21','22','23'].includes(String(this.marriage))) {
          api.toast({ msg: '婚姻状况为已婚、初婚、再婚、复婚时亲属关系只能选择配偶', location: 'middle' })
          return
        }
        let relationshipKeys = Object.keys(this.relationshipMap)
        let relationshipValues = Object.values(this.relationshipMap)
        ActionSheet('请选择亲属关系', relationshipValues, (index) => {
          this.postData.relationship = relationshipKeys[index]
          $api.dom($api.byId('relationship'), 'input').value = relationshipValues[index]
        })
      },

      __formValidation () {
        const postData = this.postData
        let valid = true
        if (postData.marriage === '') {
          api.toast({ msg: '请选择婚姻状况', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.isChildren === '') {
          api.toast({ msg: '请选择子女状况', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.education === '') {
          api.toast({ msg: '请选择学历情况', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.academicDegree === '') {
          api.toast({ msg: '请选择学位情况', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.permanentAddress === '') {
          api.toast({ msg: '请选择户籍地址', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.isPeasant === '') {
          api.toast({ msg: '请选择是否为农户', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.workCompany === '') {
          api.toast({ msg: '请输入工作单位', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.animalHusbandryYear === '') {
          api.toast({ msg: '请输入从事畜牧行业年限', location: 'middle' })
          valid = false
          return valid
        }
        if (isNaN(postData.animalHusbandryYear)) {
          api.toast({ msg: '从事畜牧行业年限只能输入数字', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.addrProvince === '') {
          api.toast({ msg: '请选择居住地省市地区', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.addrDetail === '') {
          api.toast({ msg: '请输入居住地详细地址', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.livingConditions === '') {
          api.toast({ msg: '请选择居居住状况', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.relationship === '') {
          api.toast({ msg: '请选择亲属关系', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.relationName === '') {
          api.toast({ msg: '请输入直属亲属姓名', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.relationPhone === '') {
          api.toast({ msg: '请输入直属亲属手机号', location: 'middle' })
          valid = false
          return valid
        }
        if (!isPhoneNo(postData.relationPhone)) {
          api.toast({ msg: '直属亲属手机号格式不正确', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.idNumber === '') {
          api.toast({ msg: '请输入直属亲属身份证号码', location: 'middle' })
          valid = false
          return valid
        }
        if (!isIdCardNo(postData.idNumber)) {
          api.toast({ msg: '直属亲属身份证号码格式不正确', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.otherName === '') {
          api.toast({ msg: '请输入其他联系人姓名', location: 'middle' })
          valid = false
          return valid
        }
        if (postData.otherPhone === '') {
          api.toast({ msg: '请输入其他联系人手机号', location: 'middle' })
          valid = false
          return valid
        }
        if (!isPhoneNo(postData.otherPhone)) {
          api.toast({ msg: '其他联系人手机号格式不正确', location: 'middle' })
          valid = false
          return valid
        }
        return valid
      },

      submit () {
        if (Object.keys(this.marriageMap).length === 0) { return }
        if (Object.keys(this.educationMap).length === 0) { return }
        if (Object.keys(this.academicDegreeMap).length === 0) { return }
        if (Object.keys(this.livingConditionsMap).length === 0) { return }
        if (Object.keys(this.isPeasantMap).length === 0) { return }
        if (Object.keys(this.relationshipMap).length === 0) { return }
        if (!this.__formValidation()) { return }
        if (this.loading) { return }
        api.showProgress({ title: '加载中...', text: '', modal: false })
        this.loading = true
        let postData = this.postData
        this.service.submit(this.url, postData).then(res => {
          api.hideProgress()
          this.loading = false
          if (res.code === 200) {
            openAuthResult({
              status: 'success',
              message: '补充基本信息成功',
              title: '补充基本信息'
            })
          } else {
            api.toast({ msg: '提交失败', location: 'middle' })
          }
        }).catch(error => {
          api.hideProgress()
          this.loading = false
          api.toast({ msg: error.msg || '出错了', location: 'middle' })
        })
      }

    },
  })
}

apiready = function () {

  vmInit()

}
