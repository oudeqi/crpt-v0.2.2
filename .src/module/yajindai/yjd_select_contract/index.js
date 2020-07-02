import '../../../styles/common.less'
import './index.css'


Vue.component('list-item', {
  template: `
    <label>
      <input type="radio" name="contract" @change="onRadioChange">
      <div class="seclect-content">
        <div class="seclect-content__top">
          <div class="seclect-content__toprow">
            <span class="key">放养合同编号</span>
            <span class="value">{{data.code}}</span>
          </div>
          <div class="seclect-content__toprow">
            <span class="key">收款方</span>
            <span class="value">成都阳光农业服务有限公司</span>
          </div>
          <div class="seclect-content__toprow">
            <span class="key">签订日期</span>
            <span class="value">2019-12-12</span>
          </div>
        </div>
        <div class="seclect-content__bott">
          <div class="seclect-content__bottrow">
            <span class="key">应收保证金(元)</span>
            <span class="value">200,000.00</span>
          </div>
          <div class="seclect-content__bottrow">
            <span class="key">已收保证金(元)</span>
            <span class="value">200,000.00</span>
          </div>
          <div class="seclect-content__bottrow">
            <span class="key">剩余应收保证金(元)</span>
            <span class="value seclect-content__value--emphasize">200,000.00</span>
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


function vmInit () {
  return new Vue({
    el: '#app',
    data: function () {
      return {
        selected: null,
        list: [{
          code: 'aaaaa'
        },
        {
          code: 'bbbbbb'
        }]
      }
    },
    mounted: function () {
      
    },
    methods: {
      next () {
        console.log(JSON.stringify(this.selected))
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

}