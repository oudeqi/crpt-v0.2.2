function openBaseinfoFill() {
  api.openWin({
    name: 'html/baseinfofill/win',
    url: 'widget://html/baseinfofill/win.html',
    bgColor: '#fff'
  });
} // 打开待认证


function openCompanyInfo() {
  api.openTabLayout({
    name: 'html/companyinfo/win',
    title: '企业信息',
    url: 'widget://html/companyinfo/win.html',
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
} // 身份证上传


function openFaceAuth() {
  api.openTabLayout({
    name: 'html/faceauth/win',
    title: '企业法人人脸认证',
    url: 'widget://html/faceauth/win.html',
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
  api.parseTapmode();

  document.querySelector('#baseinfo').onclick = function () {
    openBaseinfoFill();
  };

  document.querySelector('#companyinfo').onclick = function () {
    openCompanyInfo();
  };

  document.querySelector('#faceauth').onclick = function () {
    openFaceAuth();
  };

  document.querySelector('#yuguedu').onclick = function () {
    openYuguEdu();
  };
};
