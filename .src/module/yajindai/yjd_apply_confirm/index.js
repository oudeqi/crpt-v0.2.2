import '../../../styles/common.less'
import './index.css'

import numeral from 'numeral'
import http from '../../../http'
import { ActionSheet, getPicture, setRefreshHeaderInfo } from '../../../config'
import Router from '../../../router'

class Service {
  
  static licenseUpload (file) {
    return http.upload('/crpt-cust/cust/personal/business/license/upload', {files: { personalCertNoFile: file }}, {
      headers: {},
      timeout: 10000
    })
  }

  static getProductDetail (id) {
    return http.get(`/crpt-product/product/yjd/detail/${id}`)
  }

  static getContract (type = 1) {
    return http.get(`/crpt-biz/biz/fund/protocol/query/${type}`)
  }
  
}


Vue.directive('decimal-keeps', {
  bind: function (el, binding) {
    const decimalKeeps = binding.value
    el.oninput = function (e) {
      let value = e.target.value
      if (decimalKeeps === 0) {
        let int = parseInt(value)
        if (isNaN(int)) {
          e.target.value = ''
        } else {
          e.target.value = int
        }
        el.dispatchEvent(new Event('input'))
      } else if (decimalKeeps > 0) {
        if (e.target.type === 'number') {
          // type="number" input事件，
          // e.target.value获取不到末尾的 ‘.’，但是可以获取到中间的点，
          // 如果.连出现两次，e.target.value只能娶到‘’
          // 如果.间隔出现两次，且最后一位是点，e.target.value可以取到 parseFloat后的值
          // 如果.间隔出现两次，且最后一位不是点，e.target.value只能娶到‘’
          // 如果.出现三次及三次以上，e.target.value只能娶到‘’
          // 如果-出现在非首位，value会被置为‘’，e.target.value也获取不到末尾的‘-’，
          if (!value) {
            e.target.value = ''
          }
          if (value.includes('.')) {
            let a = value.split('.')[0]
            let b = value.split('.')[1]
            e.target.value = a + '.'+ b.substring(0, decimalKeeps)
          }
        } else { // type="text"
          if (isNaN(parseFloat(value))) { // 过滤负数和非数字
            e.target.value = ''
          } else {
            if (value.includes('.')) { // 处理符号点
              let a = value.split('.')[0]
              let b = value.split('.')[1].substring(0, decimalKeeps)
              if (isNaN(parseFloat(b))) { // 处理最后一位是点
                e.target.value = parseInt(a) + '.'
              } else { // 末尾不是点
                if (isNaN(b)) { // 小数点后不是数字
                  e.target.value = parseInt(a) + '.' + parseFloat(b)
                } else {
                  e.target.value = parseInt(a) + '.' + b
                }
              }
            } else {
              e.target.value = parseInt(value) === 0 ? 0 : (parseInt(value) || '') // 尽量化为整数
            }
          }
        }
        el.dispatchEvent(new Event('input'))
      }
    }
  }
})

function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        pic: '', // 营业执照
        minAvailable: 10000, // 新网最低可用额度
        maxAvailable: 1000000, // 新网最高可用额度
        pageParam: api.pageParam || {},
        userinfo: $api.getStorage('userinfo') || {},
        productDetails: {},
        contractList: [],
        repayTypeMap: {
          4: '到期还本付息',
          5: '等额本息',
          7: '先息后本',
        },
        applyMoney: '',
        companyCode: '',
        workerCount: '',
        totalAssets: '',
        agreed: false, // 是否同意协议
      }
    },
    computed: {
      submitBtnEnable: function () { // 提交按钮是否可用
        return this.productDetails.loanTerm
        && this.pic
        && this.applyMoney
        && this.companyCode
        && this.workerCount
        && this.totalAssets
      },
      id: function () { // 代养合同id
        return this.pageParam.id
      },
      productId: function () { // 产品id
        return this.pageParam.productId
      },
      loanPayeeAccountNo: function () { // 贷款收款账号
        return this.pageParam.loanPayeeAccountNo
      },
      loanPayeeAccountName: function () { // 贷款收款账户名称
        return this.pageParam.loanPayeeAccountName
      },
      name: function () { // 贷款收款账户名称
        return this.userinfo.name
      },
      surplusReceivableBond: function () { // 剩余应收保证金
        return parseFloat(this.pageParam.surplusReceivableBond || 0)
      },
      availableValue: function () { // 实际可用额度
        let surplusReceivableBond = this.surplusReceivableBond
        let maxAvailable = this.maxAvailable
        return surplusReceivableBond > maxAvailable ? maxAvailable : surplusReceivableBond
      },
    },
    mounted: function () {
      this.initPage()
    },
    methods: {

      numeral: numeral,

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
              this.__licenseUpload(ret.data)
            }
          })
        })
      },

      async __licenseUpload (file) {
        api.showProgress({ title: '上传中...', text: '' })
        try {
          const res = await Service.licenseUpload(file)
          if (res.code === 200) {
            this.pic = file
            api.toast({ msg: '上传成功', location: 'middle' })
          }
        } catch (e) {
          this.pic = ''
          api.toast({ msg: e.msg || '出错啦', location: 'middle' })
        }
        api.hideProgress()
      },

      async initPage () {
        api.showProgress({ title: '数据加载中...', text: '' })
        await this.__getProductDetail()
        await this.__getContract()
        api.hideProgress()
      },

      async __getContract () {
        try {
          const res = await Service.getContract()
          this.contractList = res.data || []
          api.refreshHeaderLoadDone()
        } catch (e) {
          api.toast({ msg: e.msg || '获取贷款合同失败', location: 'middle' })
          api.refreshHeaderLoadDone()
        }
      },

      async  __getProductDetail () {
        try {
          const res = await Service.getProductDetail(this.productId)
          this.productDetails = res.data || {}
        } catch (e) {
          api.toast({ msg: e.msg || '获取产品详情失败', location: 'middle' })
          api.refreshHeaderLoadDone()
        }
      },

      handleContractCheckboxClick() {
        // this.contractList
        let mustRead = this.contractList.filter(item => String(item.isReadLimit) === '1')
        if (mustRead.length > 0) {
          console.log('object')
          setTimeout(() => {
            this.agreed = false
            // this.openDialog()
          })
        } else {
          setTimeout(() => {
            this.agreed = true
          })
        }
      },

      handleContractClick (record) {
        // isReadLimit 是否强制阅读   1：是   0：否
      },

      openDialog () {
        api.openFrame({
          reload: true,
          name: 'dialog',
          bounces: false,
          bgColor: 'rgba(0,0,0,0)',
          url: 'widget://html/yjd_apply_confirm/contract-msg.html',
          rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
          },
          pageParam: {
            id: '2'
          }
        })
      },

      submit () {
        if (!this.applyMoney) {
          api.toast({ msg: '请输入申请金额', location: 'middle' })
          return
        }
        if (parseFloat(this.applyMoney) > this.availableValue) {
          api.toast({ msg: '申请金额不能大于最高可贷金额', location: 'middle' })
          return
        }
        if (parseFloat(this.applyMoney) < this.minAvailable) {
          api.toast({ msg: `申请金额不能小于最低可贷金额，${this.minAvailable}元`, location: 'middle' })
          return
        }
        if (!this.pic) {
          api.toast({ msg: '请上传营业执照', location: 'middle' })
          return
        }
        if (!this.companyCode) {
          api.toast({ msg: '请输入统一社会信用代码', location: 'middle' })
          return
        }
        if (!this.workerCount) {
          api.toast({ msg: '请输入从业人数', location: 'middle' })
          return
        }
        if (String(this.workerCount).includes('.')) {
          api.toast({ msg: '从业人数不能输入小数', location: 'middle' })
          return
        }
        if (!this.totalAssets) {
          api.toast({ msg: '请输入资产总额', location: 'middle' })
          return
        }
        if (isNaN(this.totalAssets)) {
          api.toast({ msg: '资产总额只能输入数字', location: 'middle' })
          return
        }
        let createLoanOrderArgus = {
          id: this.id, // 代养合同id
          productId: this.productId, // 产品id
          maxLoanAmount: this.availableValue, // 最高可贷金额
          applyAmount: this.applyMoney, // 申请金额
          interestRate: this.productDetails.interestRate, // 贷款利率
          loanTerm: this.productDetails.loanTerm, // 贷款期限（单位：月
          loanDueDate: this.productDetails.loanDueDate, // 贷款到期日
          repayType: this.productDetails.repayType, // 还款方式（标记：4-到期还本付息；5-等额本息；7-先息后本）
          custName: this.name, // 借款人姓名
          loanPayeeAccountNo: this.loanPayeeAccountNo, // 贷款收款账号
          loanPayeeAccountName: this.loanPayeeAccountName, // 贷款收款账户名称
          personalCertNo: this.companyCode, // 个人社会信用代码
          enterpriseWorkers: this.workerCount, // 从业人数
          assetAmt: this.totalAssets, // 资产总额（万元）
          isReadAndAgree: 1, // 是否已经阅读并同意所有协议 1：是  0：否 
          userId: '' // 新网用户id
        }
        $api.setStorage('createLoanOrderArgus', createLoanOrderArgus)
        Router.openPage({ key: 'yjd_face_auth', params: { pageParam: {}}})
      }

    }

  })
}


apiready = function () {

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret) {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

  const vm = vmInit()

  setRefreshHeaderInfo(function() {
    vm.initPage()
  })

}