import '../../../app.css'
import './win.css'

import { openContactUs } from '../../../webview.js'
import { http } from '../../../config.js'
import numeral from 'numeral'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  const myChart = echarts.init(document.getElementById('chart'))
  myChart.setOption({
    color:['#66BB6A', '#dddddd'],
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
          {value: 0, name: '总额度'},
          {value: 0, name: '已用额度'},
        ]
      }
    ]
  })

  document.querySelector('#contactus').onclick = function (event) {
    openContactUs()
  }

  function getPageData () {
    http.get('/crpt-credit/credit/credit/amount').then(res => {
      const data = res.data || {}
      $api.byId('availab').innerHTML = numeral(data.availablAmount).format('0,0')
      $api.byId('total').innerHTML = numeral(data.limitAmount).format('0,0')
      $api.byId('used').innerHTML = numeral(data.loanAmount).format('0,0')
      let t = numeral(data.limitAmount).subtract(data.loanAmount).value()
      let y = data.loanAmount
      myChart.setOption({
        color:['#66BB6A', '#dddddd'],
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
              {value: t, name: '总额度'},
              {value: y, name: '已用额度'},
            ]
          }
        ]
      })
    }).catch(error => {

    })
  }

  getPageData()
}
