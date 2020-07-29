var ENV_URLS = {
  development: 'http://crptdev.liuheco.com',
  testing: 'https://gateway.crpt-cloud.liuheco.com',
  production: 'https://crpt-cloud.oak.net.cn'
};
var baseUrl = ENV_URLS["testing"];

apiready = function apiready() {
  var pageParam = api.pageParam || {};
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  var fileUrl = "".concat(baseUrl, "/crpt-file/file/download/").concat(pageParam.id); // const frameUrl = `${baseUrl}/crpt-h5/common/pdf_agreement?fileUrl=${encodeURIComponent(fileUrl)}`

  var pdfReader = api.require('pdfReader');

  pdfReader.openPdfView({
    rect: {
      x: 0,
      y: 0,
      w: 'auto',
      h: 'auto'
    },
    path: fileUrl,
    fixedOn: 'ui_window' // fixed: true

  }, function (ret) {// alert(JSON.stringify(ret));
  }); // let h = geiFixHeight() + 45
  // api.openFrame({
  //   name: 'pdf_agreement_frame',
  //   // url: frameUrl,
  //   url: 'widget://html/pdf_agreement/frm.html',
  //   title: '查看合同',
  //   useWKWebView: true,
  //   fixedOn: 'ui_window',
  //   scaleEnabled: true,
  //   rect: {
  //     marginLeft: 0,    //相对父页面左外边距的距离，数字类型
  //     marginTop: 0,     //相对父页面上外边距的距离，数字类型
  //     marginBottom: 0,  //相对父页面下外边距的距离，数字类型
  //     marginRight: 0,   //相对父页面右外边距的距离，数字类型
  //   }
  // });
};
