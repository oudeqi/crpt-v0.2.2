import '../../../styles/common.less'
import './index.css'

import numeral from 'numeral'
import Router from '../../../router'
import http from '../../../http'
import { setRefreshHeaderInfo } from '../../../config.js'

Vue.component('list-item', {
  template: `
    <label>
      <input type="radio" name="contract" @change="onRadioChange">
      <div class="seclect-content">
        <div class="seclect-content__top">
          <div class="seclect-content__toprow">
            <span class="key">放养合同编号</span>
            <span class="value">{{data.outCode}}</span>
          </div>
          <div class="seclect-content__toprow">
            <span class="key">收款方</span>
            <span class="value">{{data.orgName}}</span>
          </div>
          <div class="seclect-content__toprow">
            <span class="key">签订日期</span>
            <span class="value">{{data.signedDate ? data.signedDate.split(' ')[0] : ''}}</span>
          </div>
        </div>
        <div class="seclect-content__bott">
          <div class="seclect-content__bottrow">
            <span class="key">应收保证金(元)</span>
            <span class="value">{{numeral(data.receivableBond).format('0,0.00')}}</span>
          </div>
          <div class="seclect-content__bottrow">
            <span class="key">已收保证金(元)</span>
            <span class="value">{{numeral(data.receivedBond).format('0,0.00')}}</span>
          </div>
          <div class="seclect-content__bottrow">
            <span class="key">剩余应收保证金(元)</span>
            <span class="value seclect-content__value--emphasize">{{numeral(data.surplusReceivableBond).format('0,0.00')}}</span>
          </div>
        </div>
      </div>
    </label>
  `,
  props: ['data'],
  created: function () {
    console.log(JSON.stringify(this.data))
  },
  methods: {
    onRadioChange () {
      this.$emit('update:selected', this.data)
    }
  }
})

class Service {

  static getContract (id) {
    return http.get(`/crpt-order/order/yjd/escrow/contract/infolist/${id}`)
  }

}


function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        selected: null,
        loading: false,
        pageParam: api.pageParam || {},
        list: [],
        loading: false,
        more: 'noData', // hasMore,noMore,noData
      }
    },
    computed: {
      productId: function () {
        return this.pageParam.productId
      }
    },
    mounted: function () {
      this.initPage()
    },
    methods: {

      numeral: numeral,

      async initPage () {
        api.showProgress({ title: '数据加载中...', text: '' })
        await this.getpageList()
        api.hideProgress()
      },

      async getpageList () {
        if (this.loading) { return }
        this.loading = true
        try {
          const res = await Service.getContract(this.productId || '2')
          api.refreshHeaderLoadDone()
          if (res.data.list && res.data.list.length > 0) {
            this.list = res.data.list
            this.more = 'hasMore'
          } else {
            this.more = 'noData'
          }
        } catch (e) {
          api.toast({ msg: e.msg || '出错啦', location: 'middle' })
        }
        this.loading = false
      },

      next () {
        console.log(JSON.stringify(this.selected))
        // if (this.selected) {}
        const productId = this.productId
        const { id, loanPayeeAccountNo, loanPayeeAccountName, surplusReceivableBond }= this.selected || {}
        Router.openPage({ key: 'yjd_apply_confirm', params: { pageParam: {
          id, productId, loanPayeeAccountNo, loanPayeeAccountName, surplusReceivableBond
        }}})
        
      }

    },
  })
}

apiready = function () {

  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeToWin({
        name: 'yjd_product_detail'
      })
    }
  })

  const vm = vmInit()

  setRefreshHeaderInfo(function() {
    vm.getpageList()
  })

}