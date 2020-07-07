import '../../app.css'
import './win.less'

import http from '../../http/index.js'
import Utils from '../../utils'
import filter from '../../utils/filter'
import Router from '../../router'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  const page = new Vue({
    el: '#app',
    data: {
      dataArr: [],
      statusObj: {
        1: '正常',
        2: '未按期还款',
        3: '今日还款'
      },
      filter
    },
    async mounted () {
      this.getData()
      Utils.UI.setRefreshHeaderInfo({
        success: () => {
          this.getData()
          setTimeout(() => {
            api.refreshHeaderLoadDone()
          }, 0);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        }
      })
      // this.creditStatusObj = await filterDict('creditStatus')
    },
    methods: {
      async getData () {
        this.dataArr = []
        Utils.UI.showLoading('加载中')
        try {
          const res = await http.post('/crpt-credit/credit/repay/mybill/billlist')
          this.package(res.data.list)
          Utils.UI.hideLoading()
        } catch (err) {
          Utils.UI.hideLoading()
        }
      },
      /**
       * @author Sunning
       * 按照年份组装数据
       */
      package (data) {
        let map = {}
        data.forEach(item => {
          let y = new Date(item.billDate).getFullYear()
          if (!map[y]) {
            map[y] = []
          }
          map[y].push(item)
        })
        for(let k in map){
          this.dataArr.push({
            year: k,
            show: true,
            children: map[k]
          })
        }
      },
      packBill (billDate) { // 组装账单title
        if (billDate) {
          let a = billDate.split('-')
          return `${a[1] > 9 ? a[1] : a[1].split('')[1]}月${a[2]}日账单`
        } else {
          return ''
        }
      },
      collapse (index) {
        if (this.dataArr[index].show) { // 如果为展开
          this.dataArr[index].show = false
        } else {
          this.dataArr[index].show = true
        }
      },
      showList (isShow) {
        if (isShow) {
          return 'child show'
        } else {
          return 'child hide'
        }
      },
      changePage (list) {
        Router.openPage({ key: 'billdetails', params: {
          pageParam: {list: list}
        }})
      }
    }
  })
}