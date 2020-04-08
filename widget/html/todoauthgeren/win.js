function openBaseinfoFill(pageParam) {
  api.openWin({
    name: 'html/baseinfofill/win',
    url: 'widget://html/baseinfofill/win.html',
    bgColor: '#fff',
    pageParam: pageParam
  });
} // 打开待认证


function openIDcardUpload() {
  api.openTabLayout({
    name: 'html/idcardupload/win',
    title: '身份证上传',
    url: 'widget://html/idcardupload/win.html',
    bgColor: '#fff',
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 确认身份证信息


function openFaceAuth(pageParam) {
  api.openTabLayout({
    name: 'html/faceauth/win',
    title: pageParam.title,
    url: 'widget://html/faceauth/win.html',
    bgColor: '#fff',
    pageParam: pageParam,
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 手持身份证上传


function openYuguEdu() {
  api.openTabLayout({
    name: 'html/yuguedu/win',
    title: '预估额度',
    url: 'widget://html/yuguedu/win.html',
    bgColor: '#fff',
    bounces: true,
    slidBackEnabled: false,
    navigationBar: {
      hideBackButton: false,
      background: '#1dc4a2',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });
} // 认证结果

apiready = function apiready() {
  var userinfo = $api.getStorage('userinfo');
  var userType = userinfo.userType;

  document.querySelector('#realAuth').onclick = function () {
    openIDcardUpload();
  };

  document.querySelector('#faceAuth').onclick = function () {
    openFaceAuth({
      userType: userType,
      // userType === '1' ? '个人账号' : '企业账号'
      title: '人脸认证'
    });
  };

  document.querySelector('#baseinfo').onclick = function () {
    openBaseinfoFill({
      userType: userType
    });
  };

  document.querySelector('#yuguedu').onclick = function () {
    openYuguEdu();
  };
};
