import '../../../app.css'
import './win.css'

import {
  openRegLogin, openBaseinfoFill, openCompanyInfo,
  openFaceAuth, openYuguEdu
} from '../../../webview.js'
import { http, getAndStorageAuthStatus, setRefreshHeaderInfo } from '../../../config.js'

apiready = function() {

  let userinfo = $api.getStorage('userinfo')
  let { userType, access_token } = userinfo || {}

  function logout (cb) {
    http.delete(`/auth/token/${access_token}`).then(res => {
      $api.removeCls($api.byId('logout'), 'loading')
      cb()
    }).catch(error => {
      $api.removeCls($api.byId('logout'), 'loading')
      api.toast({
        msg: error.msg || '操作失败',
        location: 'middle'
      })
    })
  }

  function getStatus (cb) {
    api.showProgress({
      title: '加载中...',
      text: '',
      modal: false
    })
    getAndStorageAuthStatus(function (status) {
      api.hideProgress()
      api.refreshHeaderLoadDone()
      let mapping = { // 0未通过，1通过，2人工审核
        realAuth: { status: 0, msg: '' },
        faceAuth: { status: 0, msg: '' },
        baseinfo: { status: 0, msg: '' },
      }
      // 认证状态 int
      // 1：正常
      // 2：待实名认证
      // 3：待人脸审核
      // 4：人脸认证失败，待人工审核
      // 5：待补充基本信息
      // 6：人工审核不通过
      if (status === 1) { // 认证全部通过
        mapping.realAuth.status = 1
        mapping.faceAuth.status = 1
        mapping.baseinfo.status = 1
      } else if (status === 3) { //待人脸审核
        mapping.realAuth.status = 1
      } else if (status === 4) { // 人脸认证失败，待人工审核
        mapping.realAuth.status = 1
        mapping.faceAuth.status = 2
      } else if (status === 5) { // 待补充基本信息
        mapping.realAuth.status = 1
        mapping.faceAuth.status = 1
      } else if (status === 6) { // 6：人工审核不通过
        mapping.realAuth.status = 1
        mapping.faceAuth.status = 3
      }
      cb(mapping)
    }, function () {
      api.hideProgress()
      api.refreshHeaderLoadDone()
    })
  }

  function renderStep1 (status) {
    if (status === 0) {
      $api.byId('step1').innerHTML = `
        <div class="auth-block" tapmode="active" id="companyInfo">
          <div class="badge">1</div>
          <div class="text">
            <div>
              <strong>企业实名认证</strong>
              <span class="icon"></span>
            </div>
            <p>请准备法定代表人的二代身份证</p>
          </div>
          <div class="pic idcard"></div>
        </div>
      `
    } else {
      $api.byId('step1').innerHTML = `
        <div class="auth-block2 authpass" id="companyInfoResult">
          <div class="badge">1</div>
          <div class="text">
            <strong>实名认证</strong>
          </div>
          <div class="pic"></div>
          <span>通过</span>
        </div>
      `
    }
  }

  function renderStep2 (status) {
    if (status === 0) {
      $api.byId('step2').innerHTML = `
        <div class="auth-block" tapmode="active" id="faceAuth">
          <div class="badge">2</div>
          <div class="text">
            <div>
              <strong>法定代表人进行人脸认证</strong>
              <span class="icon"></span>
            </div>
            <p>需要法定代表人本人完成人脸认证</p>
          </div>
          <div class="pic facescan"></div>
          ${status === 1 ? '<span>通过</span>' : ''}
        </div>
      `
    } else {
      // autherror
      let type = 'authpass'
      if (status === 2) {
        type = 'authing'
      }
      if (status === 3) {
        type = 'autherror'
      }
      // <span>图片模糊</span>
      $api.byId('step2').innerHTML = `
        <div class="auth-block2 ${type}" id="faceAuthResult">
          <div class="badge">2</div>
          <div class="text">
            <strong>法定代表人脸认证</strong>
          </div>
          <div class="pic"></div>
          ${
            status === 1
            ? '<span>通过</span>'
            : status === 3
            ? '<span>人工审核失败<br />请联系客服</span>'
            : ''
          }
        </div>
      `
    }
  }

  function renderStep3 (status) {
    if (status === 0) {
      $api.byId('step3').innerHTML = `
        <div class="auth-block" tapmode="active" id="baseinfo">
          <div class="badge">3</div>
          <div class="text">
            <div>
              <strong>补充基础信息</strong>
              <span class="icon"></span>
            </div>
            <p>请填写法定代表人的基础信息</p>
          </div>
          <div class="pic baseinfo"></div>
        </div>
      `
    } else {
      $api.byId('step3').innerHTML = `
        <div class="auth-block2 authpass" id="baseinfoResult">
          <div class="badge">3</div>
          <div class="text">
            <strong>补充基本信息</strong>
          </div>
          <div class="pic"></div>
          <span>成功</span>
        </div>
      `
    }
  }

  function bindEvent (mapping) {
    api.parseTapmode()
    let companyInfo = document.querySelector('#companyInfo')
    let faceAuth = document.querySelector('#faceAuth')
    let baseinfo = document.querySelector('#baseinfo')
    let yuguedu = document.querySelector('#yuguedu')
    if (companyInfo) {
      companyInfo.onclick = function () {
        openCompanyInfo()
      }
    }
    if (faceAuth) {
      faceAuth.onclick = function () {
        if (mapping.realAuth.status === 1) {
          openFaceAuth({
            userType: userType, // userType === '1' ? '个人账号' : '企业账号'
            title: '人脸认证'
          })
        } else {
          api.toast({
            msg: '请先完成第一步'
          })
        }
      }
    }
    if (baseinfo) {
      baseinfo.onclick = function () {
        if (mapping.realAuth.status === 0) {
          api.toast({
            msg: '请先完成第一步'
          })
          return
        }
        if (mapping.faceAuth.status === 0 || mapping.faceAuth.status === 2 || mapping.faceAuth.status === 3) {
          api.toast({
            msg: '请先完成第二步'
          })
          return
        }
        openBaseinfoFill()
      }
    }
    if (yuguedu) {
      yuguedu.onclick = function () {
        openYuguEdu()
      }
    }
  }

  function initPage () {
    getStatus(function (mapping) {
      // 0未通过，1通过，2人工审核
      let step = 3
      mapping.realAuth.status === 1 ? step = 2 : null
      mapping.faceAuth.status === 1 ? step = 1 : null
      mapping.baseinfo.status === 1 ? step = 0 : null
      if (step > 0) {
        $api.byId('tips').innerHTML = `完成以下<strong>${step}步</strong>，即可获得申请额度资格`
      } else if (step === 0) {
        $api.byId('yugueduContainer').innerHTML = `
          <div class="smile"></div>
          <div class="btn-box">
            <div class="app_btn" tapmode="active" id="yuguedu">立即预估额度</div>
          </div>
        `
      }
      renderStep1(mapping.realAuth.status)
      renderStep2(mapping.faceAuth.status)
      renderStep3(mapping.baseinfo.status)
      bindEvent(mapping)
    })
  }
  api.addEventListener({
    name:'viewappear'
  }, function(ret, err){
    initPage()
  })

  $api.byId('logout').onclick = function () {
    api.confirm({
      title: '提示',
      msg: '确定要退出登录吗？',
      buttons: ['确定', '取消']
    }, (ret, err) => {
      if (ret.buttonIndex === 1) {
        $api.addCls($api.byId('logout'), 'loading')
        logout(function () {
          api.toast({
            msg: '退出登录成功',
            duration: 2000,
            location: 'middle',
            global: true
          })
          let windows = api.windows()
          if (windows && windows.length > 0) { // 退出登录关闭部分win解决重新登录部分界面不刷新数据问题
            windows.forEach(win => {
              // 关闭非root、非登录注册页、非本页
              if (win.name !== 'root' && win.name !== 'html/reglogin/win' && win.name !== 'html/settings/win') {
                api.closeWin({
                  name: win.name
                })
              }
            })
          }
          setTimeout(() => {
            $api.clearStorage()
            openRegLogin()
          }, 150)
        })
      }
    })
  }

  setRefreshHeaderInfo(function(ret, err) {
    initPage()
  })

}