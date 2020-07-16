import '../../../app.css'
import './index.css'

import http from '../../../http'
import Router from '../../../router'
import { getPicture, ActionSheet } from '../../../config.js'

class Service {

  static faceOcr (file) {
    return http.upload('/crpt-cust/cust/openloan/yjd/faceauth', { files: { YJDFaceImage: file } }, {
        headers: {},
        timeout: 10000
      }
    )
  }

  static getBankInfo () {
    return http.get(`/crpt-cust/cust/openloan/prebindcardphnm`)
  }

}

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        userinfo: $api.getStorage('userinfo') || {},
        bankInfo: null
      }
    },
    computed: {
      userType: function () {
        return this.userinfo.userType
      },
    },
    mounted: function () {
      
    },
    methods: {

      selectPicture () {
        let btns = ['相机', '相册']
        let sourceType = ''
        ActionSheet('请选择', btns, index => {
          if (index === 0) {
            sourceType = 'camera'
          } else {
            sourceType = 'library'
          }
          getPicture(sourceType, (ret, err) => {
            if (ret) {
              this.__startAuth(ret.data)
            }
          })
        })
      },

      async __startAuth (file) {
        // Router.openPage({key: 'yjd_send_msgcode', params: {pageParam: {
        //   bankCardNo: 'aaa',
        //   bankCardMobile: '18989193368',
        //   bankCardName: 'xinwangbank',
        // }}})
        api.showProgress({ title: '认证中...', text: '', modal: false })
        try {
          let resOcr = await Service.faceOcr(file)
          let resBank = await Service.getBankInfo()
          if (resOcr.code === 200 && resOcr.data.result === 'YES' && resBank.code === 200) {
            const {
              bankCardNo, // 银行卡卡号
              bankCardMobile, // 银行预留手机号
              bankCardName, // 开户行名称
            } = resBank.data
            api.toast({ msg: '认证成功', location: 'middle' })
            setTimeout(() => {
              Router.openPage({key: 'yjd_send_msgcode', params: {pageParam: {
                bankCardNo,
                bankCardMobile,
                bankCardName,
              }}})
            }, 3000)
          } else {
            api.toast({ msg: resOcr.data.info || '认证失败', location: 'middle' })
          }
        } catch (e) {
          api.toast({ msg: e.msg || '认证失败', location: 'middle' })
        }
        api.hideProgress()
      }

    },
  })
}

apiready = function() {

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  vmInit()

}
