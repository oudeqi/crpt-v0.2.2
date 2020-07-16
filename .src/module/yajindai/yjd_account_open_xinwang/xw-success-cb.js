import '../../../styles/common.less'
import './xw-success-cb.css'
import Router from '../../../router'

apiready = function () {

  const { productId } = api.pageParam || {}

  console.log(productId)

  $api.byId('btn').onclick = function () {
    Router.openPage({
      key: 'yjd_select_contract',
      params: {
        pageParam: { productId }
      }
    })

    api.closeWin()
  }
  $api.byId('back').onclick = function () {
    api.closeWin()
  }
}