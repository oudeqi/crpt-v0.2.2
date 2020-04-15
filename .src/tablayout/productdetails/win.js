import '../../app.css'
import './win.css'

import { http } from '../../config.js'

apiready = function () {

  let pageParam = api.pageParam || {}
  let id = pageParam.id // 15

  function getDetails (id) {
    http.get(`/crpt-product/product/openingproduct/detail/${id}`).then(res => {
      $api.byId('name').innerHTML = res.data.name
      $api.byId('totalLimit').innerHTML = res.data.totalLimit
      $api.byId('interestRate').innerHTML = res.data.interestRate
      $api.byId('account').innerHTML = res.data.account
      $api.byId('introduce').innerHTML = res.data.introduce
    }).catch(error => {

    })
  }

  getDetails(id)

}
