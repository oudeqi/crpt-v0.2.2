import '../../app.css'
import './win.css'
// apiready = function () {
//   api.addEventListener({
//     name: 'navitembtn'
//   }, (ret, err) => {
//     alert('点击了'+ret.index+'按钮');
//   })
// }

import { openBillDetails } from '../../webview.js'

apiready = function () {

  document.querySelector('#billdetails').onclick = function () {
    openBillDetails()
  }

}
