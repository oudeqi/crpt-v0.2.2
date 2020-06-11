import '../../../app.css'
import './win.css'

import { http } from '../../../config.js'
import numeral from 'numeral'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  let pageParam = api.pageParam || {}
  let id = pageParam.id // 15
  let open = pageParam.open

  if (open === 1) {
    $api.byId('isOpen').style.display = 'block'
  } else {
    $api.byId('isOpen').style.display = 'none'
  }

  function getDetails (id) {
    http.get(`/crpt-product/product/openingproduct/detail/${id}`).then(res => {
      $api.byId('name').innerHTML = res.data.name
      $api.byId('totalLimit').innerHTML = res.data.totalLimit ? numeral(res.data.totalLimit).format('0,0.00') : ''
      $api.byId('interestRate').innerHTML = res.data.interestRate ? (res.data.interestRate + '%') : ''
      $api.byId('account').innerHTML = res.data.account || ''
      $api.byId('introduce').innerHTML = res.data.introduce || ''
    }).catch(error => {
      api.toast({
        msg: error.msg || '获取产品详情失败'
      })
    })
  }

  getDetails(id)

}
