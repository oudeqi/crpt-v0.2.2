import './index.less'
import service from './service';
import filter from './../../utils/filter'
import Utils from '../../utils';
import Router from '../../router';
import numeral from 'numeral'

apiready = function () {
  const pageParam = api.pageParam || {}
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
      availablAmount: '',
      limitAmount: '',
      loanAmount: '',
      list: []
    },

    methods: {
      handleRenderCharts({ t, y }) {
        this.myChart.setOption({
          color: ['#66BB6A', '#dddddd'],
          series: [
            {
              // name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              // roseType: 'radius',
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold',
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: t, name: '总额度' },
                { value: y, name: '已用额度' },
              ]
            }
          ]
        })
      },
      async handleGetPageData() {
        try {
          Utils.UI.showLoading('查询中')
          const res = await service.getQuota()
          if (res.code === 200) {
            const data = res.data
            this.availablAmount = numeral(data.availablAmount).format('0,0')
            this.limitAmount = numeral(data.limitAmount).format('0,0')
            this.loanAmount = numeral(data.loanAmount).format('0,0')
            let t = numeral(data.limitAmount).subtract(data.loanAmount).value()
            let y = data.loanAmount
            this.handleRenderCharts({ t, y })
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(`${error.code}: ${error.msg}`)
          }
        }
        Utils.UI.hideLoading()
      },
      async handleGetQuotaList() {
        try {
          Utils.UI.showLoading('查询中')
          const res = await service.getQuotaList()
          if (res.code === 200) {
            this.list = res.data
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(`${error.code}: ${error.msg}`)
          }
        }
        Utils.UI.hideLoading()

      },
      handleToContactUs() {
        Router.openPage({
          key: 'contactus'
        })
      }
    },
    mounted() {
      this.myChart = echarts.init(document.getElementById('chart'))
      this.handleRenderCharts({ t: 0, y: 0 })
      this.handleGetPageData()
      this.handleGetQuotaList()

      Utils.UI.setRefreshHeaderInfo({
        success: () => {
          this.handleGetPageData()
          this.handleGetQuotaList()

          setTimeout(() => {
            api.refreshHeaderLoadDone()
          }, 0);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        },
      })
    },
  })
}