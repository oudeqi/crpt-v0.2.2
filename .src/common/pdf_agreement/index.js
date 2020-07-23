import './index.less'
import { baseUrl } from '../../http/config'

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
  }
  // alert(fixHeight)
  return fixHeight;
}

apiready = function () {
  const pageParam = api.pageParam || {}
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  const fileUrl = `${baseUrl}/crpt-file/file/download/${pageParam.id}`
  const frameUrl = `${baseUrl}/crpt-h5/common/pdf_agreement?fileUrl=${encodeURIComponent(fileUrl)}`
  let h = geiFixHeight() + 45
  api.openFrame({
    name: 'pdf_agreement_frame',
    url: frameUrl,
    title: '查看合同',
    useWKWebView: true,
    fixedOn: 'ui_window',
    rect: {
      marginLeft: 0,    //相对父页面左外边距的距离，数字类型
      marginTop: 0,     //相对父页面上外边距的距离，数字类型
      marginBottom: 0,  //相对父页面下外边距的距离，数字类型
      marginRight: 0,   //相对父页面右外边距的距离，数字类型
      // x: 0,
      // y: h,
      // w: 'auto',
      // h: 'auto'
    }
  });
  // const page = new Vue({
  //   el: '#app',
  //   data: {

  //   },
  //   methods: {


  //   },
  //   mounted() {

  //   }
  // })

}