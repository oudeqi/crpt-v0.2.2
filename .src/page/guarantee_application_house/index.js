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
            // upload参数
            uploadImgType: {
                0: 'camera',
                1: 'album'
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
        //  绑定cityPicker
        this._bindCityPickerEvents()
    }
    _initData() {}

    // 绑定city picker组件
    _bindCityPickerEvents() {
        const self = this
        const dom = document.querySelector(`#shedAddress`)
        dom.onclick = function () {
            Utils.UI.setCityPicker({
                success: selected => {
                    let [province, city, district] = selected
                    self.data.pcd = {
                        province: province.name,
                        city: city.name,
                        district: district.name
                    }
                    dom.innerHTML = `<span class="fc_c_city_label selected">${province.name} ${city.name} ${district.name}</span>`
                },
                data: 'widget://res/city.json',
            })
        }
    }
}

apiready = function() {
    let pageParam = api.pageParam || {};
    api.setStatusBarStyle({
        style: 'dark'
    });
    new PageController().main()
};
