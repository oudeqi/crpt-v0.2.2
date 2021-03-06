import '../../../app.css'
import './index.css'
import http from '../../../http'
import {
  loginSuccessCallback, appLogin, saveProtocolToStorage,
  getNodeProtocolFromStorage, getProtocolFromNode
} from '../../../config.js'
import Router from '../../../router'

class Service {
  static queryArgument () {
    return http.get('/crpt-biz/biz/platform/protocol/app/query')
  }
  static getPDFId (id) {
    return http.post(`/crpt-file/file/wordRelaceBookmark`, {
      body: {
        wordFileId: id,
        businessKey: 'registrationAgreement'
      }
    })
  }
}

apiready = function() {

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  let type = 'geren' // qiye
  let sendStatus = 'notsend' // notsend:未发送,sending:发送中,countdown:倒计时中
  let submitStatus = 'notsubmit' // notsubmit:未提交,submitting:正在提交

  function radioOnChange () {
    if (this.dataset.type === 'geren') {
      showProtocol(1)
      // $api.byId('companyName').style.display = 'none'
      type = 'geren'
    } else {
      showProtocol(2)
      // $api.byId('companyName').style.display = 'block'
      type = 'qiye'
    }
  }

  document.querySelector('#geren').onclick = radioOnChange
  document.querySelector('#qiye').onclick = radioOnChange

  async function getAndSaveProtocol () {
    api.showProgress({ title: '协议加载中...', text: '', modal: true })
    try {
      const res = await Service.queryArgument()
      if (res.code === 200) {
        if (res.data.count > 0) {
          saveProtocolToStorage(res.data.list)
        } else {
          saveProtocolToStorage([])
        }
      }
    } catch (error) {
      api.toast({ msg: error.msg || '获取协议失败', location: 'middle' })
      saveProtocolToStorage([])
    }
    api.hideProgress()
  }

  async function showProtocol (type) {
    let node = getNodeProtocolFromStorage(1)
    if (node.length === 0) {
      await getAndSaveProtocol()
      node = getNodeProtocolFromStorage(1)
    }
    let tyeeNode = getProtocolFromNode(node, type)
    let tyeeNode3 = getProtocolFromNode(node, 3)
    let nodes = []
    if (tyeeNode) {
      nodes = nodes.concat(tyeeNode)
    }
    if (tyeeNode3) {
      nodes = nodes.concat(tyeeNode3)
    }
    if (nodes.length === 0) {
      api.toast({ msg: '无当前节点协议', location: 'middle' })
      return
    }
    let tpl = nodes.map(item => {
      return `<li tapmode="active" data-name="${item.protocolName}" data-id="${item.protocolFileId}">《${item.protocolName}》</li>`
    })
    console.log(tpl)
    $api.byId('agreement').innerHTML = tpl.join('')
  }

  async function showContract (id) {
    api.showProgress({ title: '协议转换中...', text: '', modal: true })
    try {
      let res = await Service.getPDFId(id)
      Router.openPage({ key: 'pdf_agreement', params: {pageParam: {
        type: 'pdf',
        id: res.data.unsignContractFileId,
      }}})
    } catch (e) {
      api.toast({ msg: e.msg || '转换PDF文件失败', location: 'middle' })
    }
    api.hideProgress()
  }

  showProtocol(1) // protocolType 1-个人，2-企业，3-通用
  document.querySelector('#agreement').onclick = (e) => {
    let strong = $api.closest(e.target, 'li')
    if (strong) {
      // showContract(strong.dataset.id)
      Router.openPage({ key: 'pdf_agreement', params: {pageParam: {
        type: 'pdf',
        id: strong.dataset.id
      }}})
    }
  }
  document.querySelector('#login').onclick = function () {
    // openReg()
    Router.openPage({
      key: 'account_login'
    })
  }

  function countDown () {
    let second = 60
    $api.byId('sendcode').innerHTML = second + '秒后重试'
    let timer = setInterval(() => {
      if (second <= 0) {
        sendStatus = 'notsend'
        $api.byId('sendcode').innerHTML = '发送验证码'
        clearInterval(timer)
      } else {
        second--
        $api.byId('sendcode').innerHTML = second + '秒后重试'
      }
    }, 1000)
  }

  document.querySelector('#sendcode').onclick = function () {
    if (sendStatus === 'notsend') {
      let tel = $api.byId('tel').value.trim()
      if (!tel) {
        return api.toast({ msg: '请输入手机号码', location: 'middle' })
      }
      sendStatus = 'sending'
      $api.byId('sendcode').innerHTML = '正在发送中...'
      http.post('/crpt-cust/sms/smsverificationcode', {
        body: { phone: tel }
      }).then(ret => {
        sendStatus = 'countdown'
        countDown()
      }).catch(error => {
        api.toast({ msg: error.msg || '验证码发送失败', location: 'middle' })
        sendStatus = 'notsend'
        $api.byId('sendcode').innerHTML = '发送验证码'
      })
    }
  }

  document.querySelector('#submit').onclick = function () {
    let personRegister = '/crpt-cust/identification/personregister'
    let enterpriseRegister = '/crpt-cust/identification/enterpriseregister'
    let url = type === 'geren' ? personRegister : enterpriseRegister
    if (submitStatus === 'notsubmit') {
      // let companyName = $api.byId('name').value.trim()
      let tel = $api.byId('tel').value.trim()
      let code = $api.byId('code').value.trim()
      let pwd = $api.byId('pwd').value.trim()
      let repwd = $api.byId('repwd').value.trim()
      // if (type === 'qiye' && !companyName) {
      //   return api.toast({ msg: '请输入企业全称', location: 'middle' })
      // }
      if (!tel) {
        return api.toast({ msg: '请输入手机号码', location: 'middle' })
      }
      if (!code) {
        return api.toast({ msg: '请输入验证码', location: 'middle' })
      }
      if (!pwd) {
        return api.toast({ msg: '请输入密码', location: 'middle' })
      }
      if (pwd !== repwd) {
        return api.toast({ msg: '两次密码输入不一致', location: 'middle' })
      }
      if (!$api.byId('checkbox').checked) {
        return api.toast({ msg: '请仔细阅读，并同意协议', location: 'middle' })
      }
      submitStatus = 'submitting'
      let body = {
        phone: tel,
        password: Base64.encode(pwd),
        confirmPassword: Base64.encode(pwd),
        verification: code
      }
      // if (type === 'qiye') {
      //   body.name = companyName
      // }
      $api.addCls($api.byId('submit'), 'loading')
      http.post(url, { body }).then(ret => {
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
        api.toast({ msg: '注册成功', location: 'middle', global: true })
        let body = {
          // userType: type === 'geren' ? 1 : 2, // 1个人用户登录，2企业用户登录
          username: tel,
          loginType: 1, // 登录方式,1-账密登录，2-验证码登录（企业只能是2）
          // verification: code,
          password: pwd,
        }
        appLogin(body, function (userinfo) {
          loginSuccessCallback(userinfo)
        })
      }).catch(error => {
        api.toast({
          msg: error.msg || '注册失败',
          location: 'middle'
        })
        submitStatus = 'notsubmit'
        $api.removeCls($api.byId('submit'), 'loading')
      })
    }
  }

}
