import '../../app.css'
import './frm.css'

import { openAuthResult } from '../../webview.js'
import { http, openActionSheet, openCityList, openCitySelector, openUIInput2 } from '../../config.js'

apiready = function() {

  let userinfo = $api.getStorage('userinfo')
  let userType = userinfo.userType
  $api.byId('userType1').innerHTML = userType === '1' ? '个人' : '法定代表人'
  $api.byId('userType2').innerHTML = userType === '1' ? '个人' : '法定代表人'


  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交
  let residentialAddress = '' // 现居地址为： address + addressDetails
  let postData = {
    marriage: '',
    isChildren: '',
    education: '',
    permanentAddress: '',
    address: '',
    addressDetails: '',
    relationship: '',
    relationName: '',
    relationPhone: '',
    otherName: '',
    otherPhone: '',
  }

  // 婚姻状况 1：已婚   2：未婚 3：离异
  document.querySelector('#marriage').onclick = function () {
    let btns = ['已婚', '未婚', '离异 ']
    openActionSheet('请选择婚姻状况', btns, function (index) {
      $api.dom($api.byId('marriage'), 'input').value = btns[index]
      postData.marriage = String(index + 1)
    })
  }

  // 子女状况  0：无子女 1：有子女
  document.querySelector('#isChildren').onclick = function () {
    let btns = ['无子女', '有子女']
    openActionSheet('请选择子女状况', btns, function (index) {
      $api.dom($api.byId('isChildren'), 'input').value = btns[index]
      postData.isChildren = String(index)
    })
  }

  // 教育情况 ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学']
  document.querySelector('#education').onclick = function () {
    let btns = ['博士后', '博士研究生', '硕士研究生', '本科', '专科', '中专/高中', '初中', '小学']
    openActionSheet('请选择教育情况', btns, function (index) {
      $api.dom($api.byId('education'), 'input').value = btns[index]
      postData.education = btns[index]
    })
  }

  // 户籍地址
  document.querySelector('#permanentAddress').onclick = function () {
    openCityList(selected => {
      $api.dom($api.byId('permanentAddress'), 'input').value = selected.city
      postData.permanentAddress = selected.city
    })
  }

  // 现居住信息
  document.querySelector('#address').onclick = function () {
    openCitySelector(selected => {
      let a = selected[0]
      let b = selected[1]
      let c = selected[2]
      $api.dom($api.byId('address'), 'input').value = a.name + b.name + c.name
      postData.address = a.name + b.name + c.name
    })
  }

  // 详细地址
  openUIInput2($api.byId('addressDetails'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.addressDetails = value
  })

  // 亲属关系  标记  1-配偶 2-子女 3-父母  4-其他
  document.querySelector('#relationship').onclick = function () {
    let btns = ['配偶', '子女', '父母', '其他']
    openActionSheet('请选择亲属关系', btns, function (index) {
      $api.dom($api.byId('relationship'), 'input').value = btns[index]
      postData.relationship = String(index + 1)
    })
  }

  // 姓名
  openUIInput2($api.byId('relationName'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.relationName = value
  })

  // 手机号
  openUIInput2($api.byId('relationPhone'), {
    placeholder: '请输入',
    keyboardType: 'number',
    maxStringLength: 11
  }, function (value) {
    postData.relationPhone = value
  })

  // 姓名
  openUIInput2($api.byId('otherName'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.otherName = value
  })

  // 手机号
  openUIInput2($api.byId('otherPhone'), {
    placeholder: '请输入',
    keyboardType: 'number',
    maxStringLength: 11
  }, function (value) {
    postData.otherPhone = value
  })

  document.querySelector('#submit').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!postData.marriage) {
        return api.toast({ msg: '请选择婚姻状况' })
      }
      if (!postData.isChildren) {
        return api.toast({ msg: '请选择子女状况' })
      }
      if (!postData.education) {
        return api.toast({ msg: '请选择教育情况' })
      }
      if (!postData.permanentAddress) {
        return api.toast({ msg: '请选择户籍地址' })
      }
      if (!postData.address) {
        return api.toast({ msg: '请选择居住地省市地区' })
      }
      if (!postData.addressDetails) {
        return api.toast({ msg: '请选择居住地详细地址' })
      }
      if (!postData.relationship) {
        return api.toast({ msg: '请选择亲属关系' })
      }
      if (!postData.relationName) {
        return api.toast({ msg: '请输入直属亲属姓名' })
      }
      if (!postData.relationPhone) {
        return api.toast({ msg: '请输入直属亲属手机号' })
      }
      if (!postData.otherName) {
        return api.toast({ msg: '请输入其他联系人姓名' })
      }
      if (!postData.otherPhone) {
        return api.toast({ msg: '请输入其他联系人手机号' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('submit'), 'loading')
// 个人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/personinfo/submission
// 企业法人补充基本信息：http://crptdev.liuheco.com/crpt-cust/saas/legalinfo/submission
      http.post('/crpt-cust/saas/personinfo/submission', {
        body: {
          ...postData,
          residentialAddress: postData.address + postData.addressDetails
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
          openAuthResult('success', '补充基本信息成功', '补充基本信息')
      }).catch(error => {
        api.toast({
          msg: error.msg || '提交失败',
          location: 'middle'
        })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
      })
    }
  }

}
