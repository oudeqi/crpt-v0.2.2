/**
 * @authro liyang
 * @desc 表单单选框picker
 * @params params: { data, success }
 */
const setPicker = function(params) {
    let UIActionSelector = api.require('UIActionSelector')
    UIActionSelector.open({
        // datas: 'widget://res/city.json',
        datas: params.data,
        layout: {
            row: 4,
            col: 1,
            height: 40,
            size: 14,
            sizeActive: 16,
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
            bgActive: '#ccc',
            color: '#888',
            colorActive: '#fff'
        },
        ok: {
            text: '确定',
            size: 15,
            w: 90,
            h: 35,
            bg: 'rgba(102,187,106,1)',
            bgActive: '#ccc',
            color: '#fff',
            colorActive: '#fff'
        },
        title: {
            text: '请选择',
            size: 15,
            h: 50,
            bg: '#eee',
            color: '#888'
        },
        fixedOn: api.frameName
    }, function(ret, err) {
        if (ret.eventType === 'ok') {
            params.success && params.success(ret.selectedInfo)
        }
    })
    return UIActionSelector
}
 export default setPicker
