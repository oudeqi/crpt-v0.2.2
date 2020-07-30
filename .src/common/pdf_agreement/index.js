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
  // const frameUrl = `${baseUrl}/crpt-h5/common/pdf_agreement?fileUrl=${encodeURIComponent(fileUrl)}`
  var pdfReader = api.require('pdfReader');
  // api.openFrame({
  //   name: '1232131',
  //   url: 'http://192.168.43.2:3000/crpt-h5/xw_callback/close/1?key=XUV1VNwwP4VDrHOgobVhpNnQvcFwyTZHPZmBb8kd3uYHaDNe+/JXWgmOdetrfjT38vWlKJfZ33NazYXPufg8dyNS+ThEMxt+0dIWx0vhkSL+FgRijuRnJt9KPPkXMTYRXwmKZwA/0f5zh/6UVNtgaUd4jVLl/Ons3tMIrbF1VDEuB29IFmalauPfgIy5KPwdGV3rRAZxIX0c7hG4E3MrPK6l6JrEKk0U3gRqWPgTuRKyzJi8wOZdTsVEoFHNfp6cd3IyAyzpnQjEGJeQobIwyaJODpDubO66mP+/WLsb4Lw9Qj9ssXAYr/2E1plaiJRytkMwXkK/HtURYoTNVTwjiw==&data=EjX9RmFNQMYB3CYsPJ1RIQP/wji7o+SBvt9I00Gekxq8nIqwX88BbMtaMugGeOs0Lc0DDqF5G72Ita42scXDzBeVhFzw5fT9Xjv0BBpygtd5YZRTwFfPS6XUJpoftPJN2mm0hTL770NBWR8r11+bZ6uN1QphqH1G0C8ks9Kb7I/B2VU1BqVf/bziyfIrANPv',
  //   title: "查看合同",
  //   // url: "widget://html/yjd_select_contract/index.html",
  //   bgColor: "#fff",
  //   reload: true,
  //   pageParam: {
  //     userinfo: $api.getStorage('userinfo')
  //   }
  // })
  // return
  pdfReader.openPdfView({
    rect: {
      x: 0,
      y: 0,
      w: 'auto',
      h: 'auto'
    },
    path: fileUrl,
    fixedOn: 'ui_window',
    // fixed: true
  }, function (ret) {
    // alert(JSON.stringify(ret));
  });
  // let h = geiFixHeight() + 45
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


}