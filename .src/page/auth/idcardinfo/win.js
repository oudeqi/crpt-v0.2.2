import '../../../app.css'
import './win.css'

import { openRegLogin, openBaseinfoFill, openAgreement,
openIDcardUpload, openIDcardInfo, openAuthResult } from '../../../webview.js'
import { http, initUIInput, getNodeProtocolFromStorage, getProtocolFromNode } from '../../../config.js'

apiready = function() {

  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  // let idcard = {
  //   "code":200,
  //   "msg":"",
  //   "data":{
  //     "name":"周永刚",
  //     "gender":"男",
  //     "number":"622424199409270411",
  //     "birthday":"1994-09-27",
  //     "address":"甘肃省通渭县平襄镇瓦石村高家庄社45号",
  //     "nation":"汉",
  //     "authority":"通渭县公安局",
  //     "timelimit":"20110125-20210125"
  //   }
  // }

  let pageParam = api.pageParam || {}
  let {
    name, gender, number, birthday, address,
    nation, authority, timelimit, front, back
  } = pageParam

  initUIInput($api.byId('name'), {
    placeholder: '请输入',
    keyboardType: 'done',
    maxStringLength: 10
  }, function (value) {
    name = value
  })

  // $api.byId('name').innerHTML = name
  let UIInput = api.require('UIInput')
  let iptIndex = api.systemType === 'ios' ? 1 : 0
  UIInput.insertValue({
    index: iptIndex,
    msg: name || ''
  })
  $api.byId('number').innerHTML = number || ''
  $api.byId('authority').innerHTML = authority || ''
  $api.byId('timelimit').innerHTML = timelimit || ''
  $api.byId('nation').innerHTML = nation || ''
  $api.byId('address').innerHTML = address || ''

  api.addEventListener({
    name: 'navitembtn'
  }, (ret, err) => {
    if (ret.index === 0) {
      api.closeWin()
    }
  })

  document.querySelector('#retry').onclick = function () {
    api.closeWin()
  }

  function showProtocol () {
    const userinfo = $api.getStorage('userinfo') || {}
    let node = getNodeProtocolFromStorage(2)
    if (!node) {
      api.toast({ msg: '协议不存在', location: 'middle' })
      return
    }
    let tyeeNode = getProtocolFromNode(node, userinfo.userType)
    let tyeeNode3 = getProtocolFromNode(node, 3)
    let nodes = []
    if (tyeeNode) {
      nodes = nodes.concat(tyeeNode)
    }
    if (tyeeNode3) {
      nodes = nodes.concat(tyeeNode3)
    }
    if (nodes.length === 0) {
      api.toast({ msg: '协议不存在', location: 'middle' })
      return
    }
    let tpl = nodes.map(item => {
      return `<span>《</span><strong tapmode="active" data-name="${item.protocolName}" data-id="${item.protocolFileId}">${item.protocolName}</strong><span>》</span>`
    })
    $api.byId('agreement').innerHTML = tpl.join('')
  }

  showProtocol()
  document.querySelector('#agreement').onclick = (e) => {
    let strong = $api.closest(e.target, 'strong')
    if (strong) {
      openAgreement(strong.dataset.id, strong.dataset.name)
    }
  }

  document.querySelector('#next').onclick = function () {
    if (submitStatus === 'notsubmit') {
      if (!name) {
        return api.toast({ msg: '请输入姓名' })
      }
      if (!gender || !number || !birthday || !address || !nation || !authority || !timelimit) {
        return api.toast({ msg: '未完全识别，请重新上传' })
      }
      if (!$api.byId('checkbox').checked) {
        return api.toast({ msg: '请仔细阅读，并同意协议' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('next'), 'loading')
      http.upload('/crpt-cust/saas/realnameauth', {
        values: {
          name, gender, number, birthday, address,
          nation, authority, timelimit
        },
        files: {
          certImageFront: front,
          certImageBack: back
        }
      }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
        if (ret.data.result === 'NO') {
          api.toast({
            msg: ret.data.info || '实名认证失败'
          })
        } else {
          openAuthResult('success')
        }
      }).catch(error => {
        api.toast({
          msg: error.msg || '实名认证失败'
        })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
      })
    }


  }

}
