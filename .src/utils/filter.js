/**
 * @author Sunning
 * 存放部分方法
 */
export default {
  /**
   * @author Sunning
   * 数字格式化为千分位   1000 ==> 1,000
   * @param {Object} s 要格式化的数字
   * @param {Object} n 保留几位小数
   */
  formatNumber(s, n) {
    if (s === '-' || !s) {
      return '-'
    } else {
      if (n === 0) {
        return (s || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else {
        n = n > 0 && n <= 20 ? n : 2
        s = parseFloat(Number((s + '').toString().replace(/[^\d\\.-]/g, ''))).toFixed(n) + ''
        const positive = s.toString().split('-')
        let l
        let r
        if (positive.length > 1) {
          l = positive[1].split('.')[0].split('').reverse()
          r = positive[1].split('.')[1]
        } else {
          l = s.split('.')[0].split('').reverse()
          r = s.split('.')[1]
        }
        let t = ''
        for (let i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
        }
        let result = t.split('').reverse().join('') + '.' + r
        if (positive.length > 1) result = '-' + result
        return result
      }
    }
  },
  /**
   * author: Sunning
   * 将数字格式化为千分位
   * @param {Object} value 需要转化的数字
   */
  toThousands(value) {
    if (value === '' || value === undefined || value === null) {
      return ''
    }
    value = String(value) // 强制转化为转化为字符串
    var isDecimal = value.split('.')
    if (isDecimal.length === 1) { // 如果长度为1表示没有小数，否则表示有小数
      return this.formatNumber(value, 0)
    } else {
      return this.formatNumber(isDecimal[0], 0) + '.' + isDecimal[1]
    }
  }
}
