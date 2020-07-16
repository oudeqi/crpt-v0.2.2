import '../../../styles/common.less'
import './index.css'
import { phoneNoFormat } from '../../../config.js'
import http from '../../../http'
import Router from '../../../router'

class Service {
  static preAuth () {
    return http.get('/crpt-credit/credit/openloan/prebindcardphnm/submit')
  }

  static auth ({smsCode, uniqueCode, bankCardNo, userId}) {
    return http.post('/crpt-credit/credit/openloan/prebindcardconfirmphnm', {
      body: { smsCode, uniqueCode, bankCardNo, userId }
    })
  }

  static createLoanOrder ({
    id, // 代养合同id
    productId, // 产品id
    maxLoanAmount, // 最高可贷金额
    applyAmount, // 申请金额
    interestRate, // 贷款利率
    loanTerm, // 贷款期限（单位：月
    loanDueDate, // 贷款到期日
    repayType, // 还款方式（标记：4-到期还本付息；5-等额本息；7-先息后本）
    custName, // 借款人姓名
    loanPayeeAccountNo, // 贷款收款账号
    loanPayeeAccountName, // 贷款收款账户名称
    personalCertNo, // 个人社会信用代码
    enterpriseWorkers, // 从业人数
    assetAmt, // 资产总额（万元）
    userId // 新网用户id
  }) {
    return http.post('/crpt-order/order/yjd/loan/apply', {
      body: {
        id, productId, maxLoanAmount, applyAmount, interestRate, loanTerm,
        loanDueDate, repayType, custName, loanPayeeAccountNo, loanPayeeAccountName,
        personalCertNo, enterpriseWorkers, assetAmt, userId
      }
    })
  }
}

const initSeconds = 60
let currentSeconds = 60

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        inputValue: '',
        pageParam: api.pageParam || {},
        createLoanOrderArgus: $api.getStorage('createLoanOrderArgus') || {},
        loading: false,
        code: {
          no: new Array(6).fill(''),
          loading: false,
          txt: '获取验证码',
        },
        preAuthData: {}, // 预认证获取的数据 
      }
    },
    computed: {
      bankCardNo: function () { // 银行卡卡号
        return this.pageParam.bankCardNo
      },
      bankCardMobile: function () { // 银行预留手机号
        return this.pageParam.bankCardMobile
      },
      bankCardName: function () { // 开户行名称
        return this.pageParam.bankCardName
      },
    },
    mounted: function () {
      this.handleSendCodeClick()
    },
    watch: {
      inputValue: function (val) {
        let a = val.split('')
        if (a.length < 6) {
          a.push(...new Array(6 - a.length).fill(''))
        }
        a.splice(6)
        this.code.no = a
      }
    },
    methods: {
      
      phoneNoFormat,

      handleInputClick () {
        this.$refs['hidden_ipt'].focus()
      },

      async handleInput () {
        if (this.inputValue && this.inputValue.length === 6) {
          if (this.loading) { return }
          this.loading = true
          api.showProgress({ title: '验证中...', text: '' })
          let {uniqueCode='', bankCardNo='', userId=''} = this.preAuthData
          try {
            await Service.auth({uniqueCode, bankCardNo, userId, smsCode: this.inputValue})
            // 创建贷款订单
            let postData = { ...this.createLoanOrderArgus, userId: this.preAuthData.userId }
            console.log(JSON.stringify(postData))
            await Service.createLoanOrder(postData)
            Router.openPage({ key: 'yjd_apply_result' })
          } catch (e) {
            api.toast({ msg: e.msg || '出错啦', location: 'middle' })
          }
          this.loading = false
          api.hideProgress()
        }
      },

      async handleSendCodeClick () {
        if (this.code.loading) {
          return
        }
        this.code.loading = true
        this.code.txt = '验证码发送中...'
        try {
          await this.__sendCode()
          this.__countDown()
          this.$refs['hidden_ipt'].focus()
        } catch (e) {
          this.preAuthData = {}
          this.code.loading = false
          this.code.txt = '获取验证码'
          api.toast({ msg: e.msg || '出错啦', location: 'middle' })
        }
      },

      async __sendCode () {
        let res = await Service.preAuth()
        let {
          uniqueCode, // 预签约唯一码
          bankCardNo, // 银行卡卡号
          userId, // 新网返回的新网用户id
        } = res.data
        this.preAuthData = { uniqueCode, bankCardNo, userId }
      },

      __countDown () {
        this.code.txt = currentSeconds + 's 后重新获取'
        let timer = setInterval(() => {
          currentSeconds--
          if (currentSeconds < 0) {
            currentSeconds = initSeconds
            this.code.txt = '获取验证码'
            this.code.loading = false
            clearInterval(timer)
          } else {
            this.code.txt = currentSeconds + 's 后重新获取'
          }
        }, 1000)
      },

    },
  })
}


apiready = function () {

  const vm = vmInit()

}