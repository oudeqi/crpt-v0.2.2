// 表单验证
export class Validation {
  constructor(config) {
    this.config = config
    this.isValid = true // 是否验证通过
    this.fnMap = {
      checked: (config, v, error) => {
        let value = v
        let msg = config.checked
        this.isValid = value
        if (!this.isValid) {
          error(msg)
        }
      },
      required: (config, v, error) => {
        let value = String(v)
        let msg = config.required
        this.isValid = value
        if (!this.isValid) {
          error(msg)
        }
      },
      pattern: (config, v, error) => {
        let value = v || ''
        let pattern = config.pattern[0]
        let msg = config.pattern[1]
        this.isValid = !value || pattern.test($api.trim(value))
        if (!this.isValid) {
          error(msg)
        }
      },
      max: (config, v, error) => {
        let value = parseFloat(v)
        let max = config.max[0]
        let msg = config.max[1]
        this.isValid = !value || value <= max
        if (!this.isValid) {
          error(msg)
        }
      },
      min: (config, v, error) => {
        let value = parseFloat(v)
        let min = config.min[0]
        let msg = config.min[1]
        this.isValid = !value || value >= min
        if (!this.isValid) {
          error(msg)
        }
      },
    }
  }
  __commonValidate (currentConfig, error) {
    const currentValidConfig = currentConfig.valid || {}
    const currentValue = currentConfig.get()
    const condition = currentConfig.condition // 决定是否校验
    for (k of Object.keys(currentValidConfig)) {
      const fnMap = this.fnMap
      if (!condition || (typeof condition === 'function' && condition())) {
        fnMap[k](currentValidConfig, currentValue, error)
        if (!this.isValid) {
          break
        }
      }
    }
  }
  __shapeAttrValidate (currentConfig, value, error) {
    for (k of Object.keys(currentConfig)) {
      const fnMap = this.fnMap
      fnMap[k](currentConfig, value, error)
      if (!this.isValid) {
        break
      }
    }
  }
  __shapeValidate (shape, value, error) {
    value.forEach(currentValue => {
      for (k of Object.keys(shape)) {
        // TODO
        let currentConfig = shape[key]
        this.__shapeAttrValidate(shape[k], currentValue[k], error)
        if (!this.isValid) {
          break
        }
      }
    })
  }
  __validate (error) {
    const config = this.config
    for (key of Object.keys(config)) {
      let currentConfig = config[key] || {}
      if (currentConfig.shape) {
        this.__shapeValidate(currentConfig.shape || {}, currentConfig.get(), error)
      } else {
        this.__commonValidate(currentConfig, error)
      }
      if (!this.isValid) {
        break
      }
    }
  }
  validate ({error, success}) {
    this.__validate(error)
    if (this.isValid) {
      const res = {}
      for (key of Object.keys(this.config)) {
        let revert = this.config[key].revert
        if (typeof revert === 'function') {
          revert = revert()
        } else if (typeof revert !== 'boolean') {
          revert = true
        }
        if (revert) {
          res[key] = this.config[key].get()
        }
      }
      success && success(res)
    }
  }
}

// 输入框限制
export class NumberLimit {
  constructor(el) {
    this.el = el
    this.el.oninput = function (e) {
      let value = e.target.value
      let max = parseFloat($api.attr(e.target, 'max'))
      if (max && parseFloat(value) >= max) { // 限定最大值
        return e.target.value = max
      }
      const decimalKeeps = parseInt($api.attr(el, 'decimal-keeps'))
      if (decimalKeeps) {
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
      }
    }
  }
}
