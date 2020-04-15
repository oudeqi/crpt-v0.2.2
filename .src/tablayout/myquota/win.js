import '../../app.css'
import './win.css'

import { openMsgList } from '../../webview.js'
import { http } from '../../config.js'

apiready = function () {

  const myChart = echarts.init(document.getElementById('chart'))
  myChart.setOption({
    color:['#1dc4a2', '#dddddd'],
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
          {value: 80, name: '可用额度'},
          {value: 335, name: '直接访问'},
        ]
      }
    ]
  })

  function getPageData () {
    http.get('/crpt-credit/credit/credit/amount').then(res => {
      const data = res.data || {}
      $api.byId('availab').innerHTML = data.availablAmount || '0.00'
      $api.byId('total').innerHTML = data.limitAmount || '0.00'
      $api.byId('used').innerHTML = data.loanAmount || '0.00'
    }).catch(error => {

    })
  }

  getPageData()
}
