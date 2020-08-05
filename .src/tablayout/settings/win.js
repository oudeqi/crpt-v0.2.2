import '../../app.css'
import './win.less'

import { openMsgList, openRegLogin, openChangePwd } from '../../webview.js'
import { http } from '../../config.js'
import Router from './../../router'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let userinfo = $api.getStorage('userinfo')
  let { name, userType, access_token } = userinfo

  function logout() {
    http.delete(`/auth/token/${access_token}`).then(res => {
      $api.removeCls($api.byId('logout'), 'loading')
    }).catch(error => {
      $api.removeCls($api.byId('logout'), 'loading')
    })
  }

  document.querySelector('#logout').onclick = function () {
    api.confirm({
      title: '提示',
      msg: '确定要退出登录吗？',
      buttons: ['确定', '取消']
    }, (ret, err) => {
      if (ret.buttonIndex === 1) {
        $api.addCls($api.byId('logout'), 'loading')
        logout()
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
            if (win.name !== 'root' && win.name !== 'login_index' && win.name !== 'html/settings/win') {
              api.closeWin({
                name: win.name
              })
            }
          })
        }
        setTimeout(() => {
          $api.clearStorage()
          // openRegLogin()
          Router.openPage({
            key: 'login_index'
          })
        }, 150)
      }
    })
  }

  document.querySelector('#changepwd').onclick = function () {
    // openChangePwd()
    Router.openPage({
      key: 'change_pwd'
    })
  }
  // alert(1)
  // var superFile = api.require('superFile');
  // superFile.open({path:'});
  // var pdfReader = api.require('pdfReader');
  // pdfReader.open({
  //     path: 'https://gateway.crpt-cloud.liuheco.com/crpt-file/file/download/1287970120248987648',
  //     hidden:{
  //       print: true,           
  //       export: true,          
  //       bookmark: true,         
  //       email: true           
  //     }
  // });
  // var pdfReader = api.require('pdfReader');
  // pdfReader.openView({
  //   rect: {
  //     x: 0,
  //     y: 0,
  //     w: 'auto',
  //     h: 'auto'
  //   },
  //   path: 'https://gateway.crpt-cloud.liuheco.com/crpt-file/file/download/1287970120248987648',
  //   fixedOn: api.frameName,
  //   fixed: true
  // }, function (ret) {
  //   alert(JSON.stringify(ret));
  // });

}
