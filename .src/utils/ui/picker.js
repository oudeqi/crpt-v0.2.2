const openPicker = function (params, options) {
  let UIActionSelector = api.require('UIActionSelector')
  UIActionSelector.open({
    datas: params.data,
    layout: {
      row: options.row,
      col: options.col,
      height: 40,
      size: 18,
      sizeActive: 18,
      rowSpacing: 5,
      colSpacing: 10,
      maskBg: 'rgba(0,0,0,0.2)',
      bg: '#fff',
      color: '#333',
      colorActive: '#f00',
      colorSelected: '#000'
    },
    animation: true,
    cancel: {
      text: '取消',
      size: 15,
      w: 90,
      h: 35,
      bg: '#fff',
      // bgActive: '#ccc',
      color: '#888',
      colorActive: '#ccc'
    },
    ok: {
      text: '确定',
      size: 15,
      w: 90,
      h: 35,
      bg: '#fff',
      // bgActive: '#ccc',
      color: 'rgba(102,187,106,1)',
      colorActive: '#ccc'
    },
    title: {
      text: '请选择',
      size: 15,
      h: 50,
      bg: '#fff',
      color: '#888'
    },
    fixedOn: api.frameName
  }, function (ret, err) {
    if (ret.eventType === 'ok') {
      params.success && params.success(ret.selectedInfo)
    }
  })
  return UIActionSelector
}
/**
 * @authro liyang
 * @desc 表单单选框picker
 * @params params: { data, success }
 */
export const setPicker = function (params) {
  return openPicker(params, { row: 5, col: 1 })
}

/**
 * @authro liyang
 * @desc 城市选择框picker
 * @params params: { data, success }
 */
export const setCityPicker = function (params) {
  return openPicker(params, { row: 5, col: 3 })
}
