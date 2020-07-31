import '../../../app.css'
import './index.css'

import http from '../../../http'
import Router from '../../../router'
import { getPicture, ActionSheet } from '../../../config.js'
import SDK from '../../../sdk'

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

  static createLoanOrder (args) {
    return http.post('/crpt-order/order/yjd/loan/apply', {
      body: args
    })
  }
  // id, // 代养合同id
  // productId, // 产品id
  // maxLoanAmount, // 最高可贷金额
  // applyAmount, // 申请金额
  // interestRate, // 贷款利率
  // loanTerm, // 贷款期限（单位：月
  // loanDueDate, // 贷款到期日
  // repayType, // 还款方式（标记：4-到期还本付息；5-等额本息；7-先息后本）
  // custName, // 借款人姓名
  // loanPayeeAccountNo, // 贷款收款账号
  // loanPayeeAccountName, // 贷款收款账户名称
  // personalCertNo, // 个人社会信用代码
  // enterpriseWorkers, // 从业人数
  // assetAmt, // 资产总额（万元）
  // isReadAndAgree, // 是否已经阅读并同意所有协议 1：是  0：否 
  // userId // 新网用户id

}

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        userinfo: $api.getStorage('userinfo') || {},
        createLoanOrderArgus: $api.getStorage('createLoanOrderArgus') || {},
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

      // selectPicture () {
      //   let btns = ['相机', '相册']
      //   let sourceType = ''
      //   ActionSheet('请选择', btns, index => {
      //     if (index === 0) {
      //       sourceType = 'camera'
      //     } else {
      //       sourceType = 'library'
      //     }
      //     getPicture(sourceType, (ret, err) => {
      //       if (ret && ret.data) {
      //         console.log(ret.data)
      //         this.__startAuth(ret.data)
      //       }
      //     })
      //   })
      // },

      selectPicture: async () => {
        SDK.BaiduFace.open({
          success: async (path) => {
            await this.__startAuth(path)
          }
        })
      },

      async __createLoan (userId) {
        try {
          let postData = { ...this.createLoanOrderArgus, userId }
          const res = await Service.createLoanOrder(postData)
          if (res.code === 200) {
            Router.openPage({ key: 'yjd_apply_result' })
          } else {
            api.toast({ msg: res.msg || '创建贷款申请失败', location: 'middle' })
          }
        } catch (e) {
          api.toast({ msg: e.msg || '出错啦', location: 'middle' })
        }
      },

      async __startAuth (file) {
        api.showProgress({ title: '认证中...', text: '', modal: false })
        try {
          let resOcr = await Service.faceOcr(file)
          let resBank = await Service.getBankInfo()
          if (resOcr.code === 200 && resOcr.data.result === 'YES' && resBank.code === 200) {
            const {
              bankCardNo, // 银行卡卡号
              bankCardMobile, // 银行预留手机号
              bankCardName, // 开户行名称
              xwBandBankFlag, // 是否新网贷款绑卡完成 "1"：是  "0"：否。 注： 完成时不进入预绑卡和绑卡确认
              userId, // 新网绑卡之后返回的用户ID
            } = resBank.data
            api.toast({ msg: '认证成功', location: 'middle' })
            if (String(xwBandBankFlag) === '1') { // 已经完成绑卡
              this.__createLoan(userId) // 创建贷款
            } else { // 未完成绑卡
              setTimeout(() => {
                Router.openPage({key: 'yjd_send_msgcode', params: {pageParam: {
                  bankCardNo,
                  bankCardMobile,
                  bankCardName,
                }}})
              }, 1500)
            }
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
