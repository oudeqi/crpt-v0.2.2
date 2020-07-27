import '../../../styles/common.less'
import './index.css'

import http from '../../../http'
import { ActionSheet, getPicture, isPhoneNo } from '../../../config'
import Router from '../../../router'

class Service {

  static sendCode (cardNo, phone) {
    return http.post('/crpt-cust/customer/account/code/get', {
      body: {
        cardNo,
        phone
      }
    })
  }

  static bankCardOcr (file) {
    return http.upload('/crpt-biz/biz/ocr/bankcard', { files: { file } }, {
        headers: {},
        timeout: 10000
      }
    )
  }

  static openAccount ({ cardName, cardNo, phone, verifyCode, uniqueCode }) {
    return http.post('/crpt-cust/customer/open/account/affirm', {
      body: {
        cardName,
        cardNo,
        phone,
        verifyCode,
        uniqueCode
      }
    })
  }

  static getContract (type = 2) {
    return http.get(`/crpt-biz/biz/fund/protocol/query/${type}`)
  }

  static docx2html(id) {
    return http.get('/crpt-file/file/docx2html?id=' + id)
  }

  static pdf2html(id) {
    return http.get(`/crpt-file/file/pdf2html?pdfFileId=${id}`)
  }

}

const initSeconds = 60
let currentSeconds = 60

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        bankCardNo: '', // 银行卡号
        phoneNo: '', // 手机号码
        checked: false,
        loading: false,
        code: {
          no: '', // 验证码
          loading: false,
          txt: '获取验证码',
        },
        cardName: '', // 银行卡开户行名称（ocr返回）
        uniqueCode: '', // 预签约唯一码（发送短信验证码返回）
        pageParam: api.pageParam || {},
        contractList: [] // 合同列表
      }
    },
    computed: {
      productId: function () {
        return this.pageParam.productId || ''
      }
    },
    mounted: function () {
      this.initPage()
    },
    methods: {

      async initPage () {
        api.showProgress({ title: '数据加载中...', text: '' })
        await this.__getContract()
        api.hideProgress()
      },

      async __getContract () {
        try {
          const res = await Service.getContract()
          this.contractList = res.data || []
          api.refreshHeaderLoadDone()
        } catch (e) {
          api.toast({ msg: e.msg || '获取协议失败', location: 'middle' })
          api.refreshHeaderLoadDone()
        }
      },

      handleContractClick (record) {
        // isReadLimit 是否强制阅读   1：是   0：否
        let countdown = null
        if (String(record.isReadLimit) === '1') {
          countdown = {
            desc: '同意',
            seconds: 8,
          }
        }
        api.showProgress({ title: '合同加载中...', text: '' })
        Service.docx2html(record.protocolFileId).then(res => {
          api.hideProgress()
          if (res.code === 200) {
            $api.setStorage('yjd-loan-contract', res.data.fileName)
            this.openDialog({
              title: record.fileName,
              countdown
            })
          } else {
            $api.setStorage('yjd-loan-contract', '')
            api.toast({ msg: res.msg || '合同加载失败', location: 'middle' })
          }
        }).catch(e => {
          api.hideProgress()
          $api.setStorage('yjd-loan-contract', '')
          api.toast({ msg: e.msg || '合同加载失败', location: 'middle' })
        })
      },

      openDialog ({title, countdown}) {
        api.openFrame({
          reload: true,
          name: 'dialog',
          bounces: false,
          bgColor: 'rgba(0,0,0,0)',
          url: 'widget://html/yjd_account_open/contract-msg.html',
          rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
          },
          pageParam: { title, countdown }
        })
      },

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
            if (ret && ret.data) {
              this.__bankCardOcr(ret.data)
            }
          })
        })
      },

      async __bankCardOcr (file) {
        api.showProgress({ title: '识别中...', text: '' })
        try {
          const res = await Service.bankCardOcr(file) //  {"msg":"","data":{"bankIdentificationNumber":"01040000","cardName":"医保联名借记IC卡","bankName":"中国银行","cardType":"借记卡","cardNumber":"6217582000022247241"},"code":200}
          if (res.code === 200) {
            this.bankCardNo = res.data.cardNumber || ''
            this.cardName = res.data.cardName || ''
            api.toast({ msg: '识别成功', location: 'middle' })
          }
        } catch (e) {
          this.bankCardNo = ''
          this.cardName = ''
          api.toast({ msg: e.msg || '出错啦', location: 'middle' })
        }
        api.hideProgress()
      },

      async handleSendCodeClick () {
        if (this.code.loading) {
          return
        }
        if (!this.bankCardNo.trim()) {
          api.toast({ msg: '请输入银行卡号', location: 'middle' })
          return
        }
        if (!this.phoneNo.trim()) {
          api.toast({ msg: '请输入手机号码', location: 'middle' })
          return
        }
        if (!isPhoneNo(this.phoneNo.trim())) {
          api.toast({ msg: '手机号码格式不正确', location: 'middle' })
          return
        }
        this.code.loading = true
        this.code.txt = '验证码发送中...'
        try {
          const cardNo = this.bankCardNo
          const phone = this.phoneNo
          const res = await Service.sendCode(cardNo, phone) //{"msg":"","data":{"uniqueCode":"1234"},"code":200}
          if (res.code === 200) {
            this.uniqueCode = res.data.uniqueCode || ''
            api.toast({ msg: '验证码已经发送至手机', location: 'middle' })
          } else {
            this.uniqueCode = ''
            api.toast({ msg: res.msg || '短信验证码发送失败', location: 'middle' })
          }
          this.__countDown()
        } catch (e) {
          this.code.loading = false
          this.code.txt = '获取验证码'
          this.uniqueCode = ''
          api.toast({ msg: e.msg || '短信验证码发送失败', location: 'middle' })
        }
        
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

      async submit () {
        if (this.loading) {
          return
        }
        if (!this.bankCardNo.trim()) {
          api.toast({ msg: '请输入银行卡号', location: 'middle' })
          return
        }
        if (!this.phoneNo.trim()) {
          api.toast({ msg: '请输入手机号码', location: 'middle' })
          return
        }
        if (!isPhoneNo(this.phoneNo.trim())) {
          api.toast({ msg: '手机号码格式不正确', location: 'middle' })
          return
        }
        if (!this.code.no.trim()) {
          api.toast({ msg: '请输入短息验证码', location: 'middle' })
          return
        }
        if (!this.checked) {
          api.toast({ msg: '请先仔细阅读协议', location: 'middle' })
          return
        }
        this.loading = true
        api.showProgress({ title: '数据加载中...', text: '' })
        try {
          let cardName = this.cardName
          let cardNo = this.bankCardNo
          let phone = this.phoneNo
          let verifyCode = this.code.no
          let uniqueCode = this.uniqueCode
          const res = await Service.openAccount({cardName, cardNo, phone, verifyCode, uniqueCode})
          api.hideProgress()
          if (res.code === 200) {
            let url = res.data.url
            let productId = this.productId
            Router.openPage({key: 'yjd_account_open_xinwang', params: {pageParam: { url, productId }}})
          } else {
            api.toast({ msg: res.msg || '提交失败', location: 'middle' })
          }
        } catch (e) {
          api.hideProgress()
          api.toast({ msg: e.msg || '提交失败', location: 'middle' })
        }
        this.loading = false
      }

    },
  })
}

apiready = function () {
  
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  const vm = vmInit()
  api.parseTapmode()

}