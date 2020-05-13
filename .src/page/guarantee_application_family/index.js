import Utils from './../../utils'
import '../../app.css'
import './index.less'
import {ActionSheet, getPicture} from "../../config";

/**
 * @authro liyang
 * @desc 担保业务申请表录入页Page 类
 */
class PageController {
    constructor(props) {
        //  所有表单域预置信息
        this.profile = {
            //  picker类组件json
            pickers: {
                relation: [
                    {"name": "配偶", "id": "1"},
                    {"name": "父母", "id": "2"},
                    {"name": "子女", "id": "3"}
                ]
            }
        }
        //  统一管理数据model data
        this.data = {}
    }
    //  执行函数
    main(props) {
        this._initData()
        this._bindEvents()
    }
    //  事件绑定入口
    _bindEvents() {
        const self = this
        //  绑定所有picker下拉框
        this._bindPickerEvents()
    }
    _initData() {}
    // 初始化所有picker组件
    _initPicker(name, dom) {
        const self = this
        Utils.UI.setPicker({
            success: selected => {
                let value = selected[0]
                self.data[name] = value.name
                dom.innerHTML = value.name
            },
            data: self.profile.pickers[name]
        })
    }
    // 绑定所有picker组件的事件
    _bindPickerEvents() {
        const self = this
        const pickerKeys = Object.keys(this.profile.pickers)
        pickerKeys.forEach((item,i) => {
            document.querySelector(`#${item}`).onclick = function () {
                self._initPicker(item, this)
            }
        })
    }
}

apiready = function() {
    let pageParam = api.pageParam || {};
    api.setStatusBarStyle({
        style: 'dark'
    });
    new PageController().main()
};
