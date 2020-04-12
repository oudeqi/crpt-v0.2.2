import '../../app.css'
import './frm.css'

import { http } from '../../config.js'

function openUIInput (dom, options = {}, cb) {
  let UIInput = api.require('UIInput')
  let rect = $api.offset(dom)
  let {
    maxRows,
    maxStringLength,
    inputType,
    placeholder,
    keyboardType,
    alignment,
    isCenterVertical
  } = options
  UIInput.open({
    rect: {
      x: rect.l,
      y: rect.t,
      w: rect.w,
      h: rect.h
    },
    fixed: false,
    autoFocus: false,
    maxRows: maxRows || 1,
    maxStringLength,
    inputType,
    placeholder,
    keyboardType,
    alignment,
    isCenterVertical,
    fixedOn: api.frameName,
    styles: {
      bgColor: 'rgba(0,0,0,0)',
      size: 16,
      color: '#333',
      placeholder: {
        color: '#aaa'
      }
    },
  }, function (ret) {
    UIInput.value({ id: ret.id }, function(value) {
      if (value) {
        cb && cb(value.msg)
      }
    })
  })
}

function openCitySelector (cb) {
  let UIActionSelector = api.require('UIActionSelector')
  UIActionSelector.open({
    datas: 'widget://res/city.json',
    layout: {
      row: 5,
      col: 3,
      height: 30,
      size: 12,
      sizeActive: 14,
      rowSpacing: 5,
      colSpacing: 10,
      maskBg: 'rgba(0,0,0,0.2)',
      bg: '#008000',
      color: '#fff',
      colorActive: '#f00',
      colorSelected: '#000'
    },
    animation: true,
    cancel: {
      text: '取消',
      size: 12,
      w: 90,
      h: 35,
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    ok: {
      text: '确定',
      size: 12,
      w: 90,
      h: 35,
      bg: '#fff',
      bgActive: '#ccc',
      color: '#888',
      colorActive: '#fff'
    },
    title: {
      text: '请选择',
      size: 12,
      h: 44,
      bg: '#eee',
      color: '#888'
    },
    fixedOn: api.frameName
  }, function(ret, err) {
    if (ret.eventType === 'ok') {
      cb(ret.selectedInfo)
    }
  })
}

function openCityList(cb) {
  let UICityList = api.require('UICityList')
  UICityList.open({
    rect : {
      x : 0,
      y : 0,
      w : api.frameWidth,
      h : api.frameHeight
    },
    resource : 'widget://res/UICityList.json',
    topCitys : [{
      'city' : '北京', //字符串类型；城市
      'id' : 110001, //字符串类型；城市编号
      'pinyin' : 'beijing' //（可选项）字符串类型；本字段可不传，若不传模块内会生成该城市名的pinyin，以防止城市名中的多音字乱序问题
    }],
    styles : {
      searchBar : {
        bgColor : '#696969',
        cancelColor : '#E3E3E3'
      },
      location : {
        color : '#696969',
        size : 12
      },
      sectionTitle : {
        bgColor : '#eee',
        color : '#000',
        size : 12
      },
      item : {
        bgColor : '#fff',
        activeBgColor : '#696969',
        color : '#000',
        size : 14,
        height : 40
      },
      indicator : {
        bgColor : '#fff',
        color : '#696969'
      }
    },
    searchType : 'fuzzy',
    currentCity : '北京',
    locationWay : 'GPS',
    hotTitle : '热门城市',
    fixedOn : api.frameName,
    placeholder : '输入城市名或首字母查询',
    backBtn: {
      rect: {
        x: 0,      //（可选项）数字类型；按钮左上角的 x 坐标（相对于模块）；默认：2
        y: 0,      //（可选项）数字类型；按钮左上角的 y 坐标（相对于模块）；默认：2
        w: 36,    //（可选项）数字类型；按钮的宽度；默认：36
        h: 36     //（可选项）数字类型；按钮的高度；默认：36
      },
      title: '关闭',    //（可选项）字符串类型；按钮标题；默认：不显示
      titleColor:'#000000',//（可选项）字符串类型；按钮标题颜色；默认：#ff0000
      bgColor:'',   //（可选项）字符串类型；按钮背景颜色；默认：透明
      // image:''      //（可选项）字符串类型；按钮背景图片；默认：不显示
    }
  }, function(ret, err) {
    if (ret.eventType === 'back') {
      UICityList.close()
    } else if (ret.eventType === 'selected') {
      cb(ret.cityInfo)
      UICityList.close()
    }
  })
}

function openActionSheet (title, buttons, cb) {
  api.actionSheet({
    title,
    cancelTitle: '取消',
    buttons
  }, function(ret, err) {
    let index = ret.buttonIndex // index 从1开始
    if (index !== buttons.length + 1) {
      cb(index - 1)
    }
  })
}

apiready = function() {

  let pageParam = api.pageParam || {}
  let { userType } = pageParam

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
    openActionSheet('请选择子女状况', btns, function (index) {
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
  openUIInput($api.byId('addressDetails'), {
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
  openUIInput($api.byId('relationName'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.relationName = value
  })

  // 手机号
  openUIInput($api.byId('relationPhone'), {
    placeholder: '请输入',
    keyboardType: 'number',
    maxStringLength: 11
  }, function (value) {
    postData.relationPhone = value
  })

  // 姓名
  openUIInput($api.byId('otherName'), {
    placeholder: '请输入',
    keyboardType: 'next',
    maxStringLength: 40
  }, function (value) {
    postData.otherName = value
  })

  // 手机号
  openUIInput($api.byId('otherPhone'), {
    placeholder: '请输入',
    keyboardType: 'number',
    maxStringLength: 11
  }, function (value) {
    postData.otherPhone = value
  })

  document.querySelector('#submit').onclick = function () {
    console.log(JSON.stringify(postData))
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
        // api.toast({
        //   msg: '注册成功',
        //   location: 'middle',
        //   global: true
        // })
        // api.closeWin()
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
