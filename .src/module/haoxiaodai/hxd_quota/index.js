import './index.less'
import Router from '../../../router';
import Utils from '../../../utils';
import filter from './../../../utils/filter'
import filterDict from '../../../utils/dict_filter/filter'
import service from './service';

apiready = function () {
  const pageParam = api.pageParam || {}
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  // alert(Vue)
  const page = new Vue({
    el: '#app',
    data: {
      productTotalLimit: pageParam.productTotalLimit,
      list: [],
      productTotalLimit: pageParam.productTotalLimit
    },
    methods: {
      async handleGetChangeList() {
        try {
          Utils.UI.showLoading('加载中')
          const res = await service.getChangeList({ productId: pageParam.productId })
          if (res.code === 200) {
            let len = res.data.length
            this.list = res.data.map((item, index) => {
              let d = new Date(item.changeDate.split(' ')[0])
              let isNotFirstItem = index > 0
              let prevD = isNotFirstItem ? new Date(res.data[index - 1].changeDate.split(' ')[0]) : ''
              // 只有一条数据
              if (len === 1) {
                return {
                  opType: '额度提升',
                  changeDate: this.getNowFormatDate(d),
                  limitAmount: filter.toThousands(item.limitAmount),
                  showYear: d.getFullYear(),
                  month: d.getMonth() + 1
                }
              } else {
                return {
                  opType: '额度提升',
                  changeDate: this.getNowFormatDate(d),
                  limitAmount: filter.toThousands(item.limitAmount),
                  showYear: isNotFirstItem && d.getFullYear() !== prevD.getFullYear() ? d.getFullYear() : '',
                  month: d.getMonth() + 1
                }
              }
            })
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(error.msg)
          }
        }
        Utils.UI.hideLoading()
      },
      getNowFormatDate(date) {
        // let date = new Date(d);
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = month + seperator1 + strDate;
        // let currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      }
    },
    mounted() {
      Utils.UI.setRefreshHeaderInfo({
        success: () => {
          this.handleGetChangeList()
          setTimeout(() => {
            api.refreshHeaderLoadDone()
          }, 0);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        },
      })
      this.handleGetChangeList()
    }
  })
}