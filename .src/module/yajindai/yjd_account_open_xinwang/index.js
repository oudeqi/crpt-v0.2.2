import '../../../styles/common.less'
import './index.css'
import http from '../../../http'
import Router from '../../../router'

let timer = null

function getOpenAccountStatus (productId) {
  http.get('/crpt-product/product/yjd/detail/' + productId).then(res => {
    const openAccountStatus = String(res.data.openHopeAccountFlag)
    if (res.code === 200 && openAccountStatus === '1') {
      clearInterval(timer)
      Router.openPage({
        key: 'yjd_select_contract',
        params: {
          pageParam: { productId }
        }
      })
    }
  })
}

apiready = function () {
  
  const statusBar = document.querySelector('#status_bar')
  $api.fixStatusBar(statusBar)
  const offset = $api.offset(statusBar)
  const { url, productId } = api.pageParam || {}
  api.openFrame({
    name: 'yjd_account_open_xinwang_frm',
    url: url,
    // url: 'https://gateway.crpt-cloud.liuheco.com/crpt-h5/xw_callback/close',
    rect: {
      x: 0,
      y: offset.h,
      w: 'auto',
      h: 'auto',
    },
    pageParam: {
      productId: productId
    },
    progress: {
      type: 'page', // 加载进度效果类型，默认值为 default，取值范围为 default|page，为 page 时，进度效果为仿浏览器类型，固定在页面的顶部
      // title: '', // type 为 default 时显示的加载框标题，字符串类型
      // text: '', // type 为 default 时显示的加载框内容，字符串类型
      // color: '#45C01A', // type 为 page 时进度条的颜色，默认值为 #45C01A，支持#FFF，#FFFFFF，rgb(255,255,255)，rgba(255,255,255,1.0)等格式
      // height:  3, // type 为 page 时进度条高度，默认值为3，数字类型
    }
  })

  // timer = setInterval(function () {
  //   getOpenAccountStatus(productId)
  // }, 3000)
  
}