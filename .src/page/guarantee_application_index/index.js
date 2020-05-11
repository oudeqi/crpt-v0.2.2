import Utils from './../../utils'
import '../../app.css'
import './index.less'
import {ActionSheet, getPicture} from "../../config";

/**
 * @authro liyang
 * @desc 担保业务申请表录入页Page 类
 */
class Page {
    constructor(props) {
        //  所有表单域预置信息
        this.profile = {
            //  picker类组件json
            pickers: {
                landType: [
                    {"name": "一般耕地", "id": "1"},
                    {"name": "基本农田", "id": "2"},
                    {"name": "山地", "id": "3"},
                    {"name": "林地", "id": "4"},
                    {"name": "草地", "id": "5"}
                ],
                farmType: [
                    {"name": "鸡", "id": "1"},
                    {"name": "鸭", "id": "2"},
                    {"name": "猪", "id": "3"}
                ]
            },
            //  select类组件json
            selects: {
                envReport: [
                    {"name": "无环评", "id": "1"},
                    {"name": "环评备案", "id": "2"},
                    {"name": "环评报告", "id": "3"}
                ],
                livestockType: [
                    {"name": "自有", "id": "1"},
                    {"name": "租赁", "id": "2"}
                ],
                shedStructure: [
                    {"name": "墙体结构", "id": "1"},
                    {"name": "立柱式", "id": "2"}
                ]
            },
            // upload参数
            uploadImgType: {
                0: 'camera',
                1: 'album'
            }
        }
        //  统一管理数据model data
        this.data = {}
        this.main(props)
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
        //  绑定所有select选择框
        this._bindSelectEvents()
        //  绑定cityPicker
        this._bindCityPickerEvents()
        //  绑定环评材料上传
        this._bindUploadReportFile()
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
                // 副作用effects
                // 1. 环评材料选择为无环保时，需要将环保附件上传栏隐藏
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
    // 初始化所有Select组件
    _initSelect() {}
    // 绑定所有select组件事件
    _bindSelectEvents() {
        const self = this
        const selectKeys = Object.keys(this.profile.selects)
        const defaultClassName = 'fc_c_option'
        const activeClassName = 'active'
        selectKeys.forEach((item,i) => {
            //  由组件级代理
            let parant = document.querySelector(`#${item}`)
            parant.onclick = function(e) {
                let list = parant.querySelectorAll(`.${defaultClassName}`)
                let ev = window.event || e;
                if (ev.target.nodeName === 'SPAN') {
                    for (let i = 0; i < list.length; i++) {
                        list[i].classList.remove(activeClassName)
                        // list[i].className = defaultClassName;
                    }
                    ev.target.classList.add(activeClassName);
                    self.data[item] = ev.target.innerHTML

                    // 副作用effects
                    // 1. 环评材料选择为无环保时，需要将环保附件上传栏隐藏
                }
            }
        })
    }
    _bindUploadReportFile() {
        const self = this
        const dom = document.querySelector('#envReportFile')
        const box = document.querySelector('#envReportFile-img-box')
        const img = document.querySelector('#envReportFile-img')
        dom.onclick = function() {
            ActionSheet('请选择', ['相机', '相册'], function (index) {
                getPicture(self.profile.uploadImgType[index], function(res, err) {
                    if (res) {
                        self.envReportFile = res.data
                        if(res.data) {
                            img.src = res.data;
                            box.classList.remove('hidden')
                        }else {
                            api.toast({
                                msg: '未上传成功',
                                duration: 2000,
                                location: 'middle'
                            });
                        }
                    }
                })
            })
        }
    }

}

apiready = function() {
    let pageParam = api.pageParam || {};
    api.setStatusBarStyle({
        style: 'dark'
    });
    new Page().main()
};
