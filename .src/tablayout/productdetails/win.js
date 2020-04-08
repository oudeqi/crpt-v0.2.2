import '../../app.css'
import './win.css'

// apiready = function () {
//   api.addEventListener({
//     name: 'navitembtn'
//   }, (ret, err) => {
//     alert('点击了'+ret.index+'按钮');
//   })
// }

import { openMsgList } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  function getDetails (id) {
    http.get(`/crpt-product/product/openingproduct/detail/${id}`).then(res => {

    }).catch(error => {

    })

  }

  getDetails(15)

}
