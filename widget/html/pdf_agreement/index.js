var ENV_URLS = {
  development: 'http://crptdev.liuheco.com',
  testing: 'https://gateway.crpt-cloud.liuheco.com',
  production: 'https://gateway.crpt-cloud.app.oak.net.cn'
};
var baseUrl = ENV_URLS["testing"]; // export const baseUrl = "testing" === 'development' ? dev : "testing" === 'testing' ? uat : prod

function geiFixHeight() {
  var fixHeight = 0;
  var strDM = api.systemType;

  if (strDM == 'ios') {
    var strSV = api.systemVersion;
    var numSV = parseInt(strSV, 10);
    var fullScreen = api.fullScreen;
    var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;

    if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
      fixHeight = 20;
    }
  } else if (strDM == 'android') {
    var ver = api.systemVersion;
    ver = parseFloat(ver);

    if (ver >= 4.4) {
      fixHeight = 25;
    }
  } // alert(fixHeight)


  return fixHeight;
}

apiready = function apiready() {
  var pageParam = api.pageParam || {};
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  var fileUrl = "".concat(baseUrl, "/crpt-file/file/download/").concat(pageParam.id);
  var frameUrl = "".concat(baseUrl, "/crpt-h5/common/pdf_agreement?fileUrl=").concat(encodeURIComponent(fileUrl));
  var h = geiFixHeight() + 45;
  api.openFrame({
    name: 'pdf_agreement_frame',
    url: frameUrl,
    title: '查看合同',
    useWKWebView: true,
    rect: {
      marginLeft: 0,
      //相对父页面左外边距的距离，数字类型
      marginTop: h,
      //相对父页面上外边距的距离，数字类型
      marginBottom: 0,
      //相对父页面下外边距的距离，数字类型
      marginRight: 0 //相对父页面右外边距的距离，数字类型
      // x: 0,
      // y: h,
      // w: 'auto',
      // h: 'auto'

    }
  }); // const page = new Vue({
  //   el: '#app',
  //   data: {
  //   },
  //   methods: {
  //   },
  //   mounted() {
  //   }
  // })
};
