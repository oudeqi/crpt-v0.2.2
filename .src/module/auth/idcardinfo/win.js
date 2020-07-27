import '../../../app.css'
import './win.css'

import { openAuthResult } from '../../../webview.js'
import { http, getNodeProtocolFromStorage, getProtocolFromNode } from '../../../config.js'
import Router from '../../../router'

class Service {

  static getContract (type = 3) {
    return http.get(`/crpt-biz/biz/fund/protocol/query/${type}`)
  }

  static getPDFId (id) {
    return http.post(`/crpt-file/file/wordRelaceBookmark`, {
      body: {
        wordFileId: id
      }
    })
    
  }
}

apiready = function() {
  let unsignContractFileId = '' // 未签约的pdf文件id
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交
  let pageParam = api.pageParam || {}
  let {
    name, gender, number, birthday, address,
    nation, authority, timelimit, front, back
  } = pageParam
  let userinfo = $api.getStorage('userinfo') || {}
  if (userinfo.userType === '1') { // userType === '1' ? '个人账号' : '企业账号'
    $api.byId('companyName').innerHTML = '“您”'
  } else {
    $api.byId('companyName').innerHTML = '“'+userinfo.name+'”法定代表人'
  }
  $api.byId('name').value = name
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

  async function showProtocol () {
    const userinfo = $api.getStorage('userinfo') || {}
    let node = getNodeProtocolFromStorage(2)
    if (!node) {
      api.toast({ msg: '协议不存在', location: 'middle' })
      return
    }
    let tyeeNode = getProtocolFromNode(node, userinfo.userType) // protocolType 1-个人，2-企业，3-通用
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
    api.showProgress({ title: '协议加载中...', text: '', modal: false })
    let agreement = nodes[0]
    try {
      let res = await Service.getPDFId(agreement.protocolFileId)
      let tpl = `<li tapmode="active" data-name="${agreement.protocolName}" data-id="${res.data.unsignContractFileId}">《${agreement.protocolName}》</li>`
      $api.byId('agreement').innerHTML = tpl
      unsignContractFileId = res.data.unsignContractFileId
    } catch (e) {
      api.toast({ msg: e.msg || '获取PDF文件失败', location: 'middle' })
    }
    api.hideProgress()
  }

  showProtocol()
  document.querySelector('#agreement').onclick = (e) => {
    let strong = $api.closest(e.target, 'li')
    if (strong) {
      Router.openPage({ key: 'pdf_agreement', params: {pageParam: {
        type: 'pdf',
        id: strong.dataset.id
      }}})
    }
  }

  document.querySelector('#next').onclick = function () {
    if (submitStatus === 'notsubmit') {
      let name = $api.byId('name').value.trim()
      if (!name) {
        return api.toast({ msg: '请输入姓名', location: 'middle' })
      }
      if (!gender || !number || !birthday || !address || !nation || !authority || !timelimit) {
        return api.toast({ msg: '未完全识别，请重新上传', location: 'middle' })
      }
      if (!unsignContractFileId) {
        return api.toast({ msg: '获取协议失败', location: 'middle' })
      }
      if (!$api.byId('checkbox').checked) {
        return api.toast({ msg: '请仔细阅读，并同意协议', location: 'middle' })
      }
      submitStatus = 'submitting'
      $api.addCls($api.byId('next'), 'loading')
      api.showProgress({ title: '加载中...', text: '', modal: false })
      http.upload('/crpt-cust/saas/realnameauth', {
        values: {
          name, gender, number, birthday, address,
          nation, authority, timelimit, 
          fileId: unsignContractFileId // 未签章的pdf文件id
        },
        files: {
          certImageFront: front,
          certImageBack: back
        }
      }).then(ret => {
        api.hideProgress()
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
        if (ret.data.result === 'NO') {
          api.toast({
            msg: ret.data.info || '实名认证失败'
          })
        } else {
          openAuthResult({status: 'success'})
        }
      }).catch(error => {
        api.hideProgress()
        api.toast({
          msg: error.msg || '实名认证失败'
        })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('next'), 'loading')
      })
    }


  }

}
