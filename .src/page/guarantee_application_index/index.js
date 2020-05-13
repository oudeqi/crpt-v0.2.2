import Utils from './../../utils'
import '../../app.css'
import './index.less'
import {http} from "../../config";
import Service from './service'

/**
 * @authro liyang
 * @desc 担保业务申请表录入页Page 类
 */
class PageController extends Service {
    /**
     * @param props { pageParam: { gtId, flowStatus } }
     */
    constructor(props) {
        super()
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
        this.data = {
            gtId: props.pageParam.gtId,
            flowStatus: props.flowStatus,
            isInsert: true,
            status: {},
            pcd: {
                province: {},
                city: {},
                district: {}
            }
        }
    }

    //  执行函数
    main() {
        this.initData()
        this.bindEvents()
    }

    //  事件绑定入口
    bindEvents() {
        const self = this
        //  绑定所有picker下拉框
        this.bindPickerEvents()
        //  绑定所有select选择框
        this.bindSelectEvents()
        //  绑定cityPicker
        this.bindCityPickerEvents()
        //  绑定环评材料上传
        this.bindUploadReportFileEvents()
        //  绑定土地信息与养殖信息折叠面板事件
        this.bindCollapseEvents()
        // 路由跳转
        this.bindEventsPageRouter()
        //  提交表单
        this.bindSubmitEvents()
    }

    async initData() {
        //  1. 刷子表状态
        const guaranteeRes = await this.getQueryGuaranteeMain()
        if (guaranteeRes.data) {
            const {houseFillStatus, carFillStatus, socialFillStatus} = guaranteeRes.data
            Boolean(houseFillStatus) && document.querySelector('#houseInfoStatus').classList.add('done')
            Boolean(carFillStatus) && document.querySelector('#carInfoStatus').classList.add('done')
            Boolean(socialFillStatus) && document.querySelector('#familyInfoStatus').classList.add('done')
        }

        //  2. 查经营信息中土地信息和养殖信息子表以及接口类型
        const gtId = this.data.gtId
        const operateRes = await this.getQueryOperate({gtId})
        //  3005 担保运营数据不存在，则提交按钮应为insert接口，同时土地信息和养殖信息置灰
        if (operateRes.code === 3005) {
            this.data.isInsert = true
        } else if (operateRes.code === 200) {
            // 土地信息和养殖信息 绿勾
            this.data.isInsert = false
            document.querySelector('#landInfoStatus').classList.add('done')
            document.querySelector('#farmInfoStatus').classList.add('done')
        } else {
            api.toast({
                msg: operateRes.msg,
                duration: 1000,
                location: 'middle'
            })
        }
    }

    // 初始化所有picker组件
    initPicker(name, dom) {
        const self = this
        Utils.UI.setPicker({
            success: selected => {
                let value = selected[0]
                self.data[name] = value.id
                dom.innerHTML = value.name
                // 副作用effects
                // 1. picker为farmType时，需要将养殖规模的单位进行调整
                if (name === 'farmType') {
                    let _dom = document.querySelector('#scaleUnit')
                    if (value.name === '猪') {
                        _dom.innerHTML = '头'
                    } else {
                        _dom.innerHTML = '万只'
                    }
                }
            },
            data: self.profile.pickers[name]
        })
    }

    // 绑定所有picker组件的事件
    bindPickerEvents() {
        const self = this
        const pickerKeys = Object.keys(this.profile.pickers)
        pickerKeys.forEach((item, i) => {
            document.querySelector(`#${item}`).onclick = function () {
                self.initPicker(item, this)
            }
        })
    }

    // 绑定city picker组件
    bindCityPickerEvents() {
        const self = this
        const dom = document.querySelector(`#shedAddress`)
        dom.onclick = function () {
            Utils.UI.setCityPicker({
                success: selected => {
                    let [province, city, district] = selected
                    self.data.pcd = {
                        province: {
                            name: province.name,
                            code: province.id
                        },
                        city: {
                            name: city.name,
                            code: city.id
                        },
                        district: {
                            name: district.name,
                            code: district.id
                        }
                    }
                    dom.innerHTML = `<span class="fc_c_city_label selected">${province.name} ${city.name} ${district.name}</span>`
                },
                data: 'widget://res/city.json',
            })
        }
    }

    // 绑定所有select组件事件
    bindSelectEvents() {
        const self = this
        const selectKeys = Object.keys(this.profile.selects)
        const defaultClassName = 'fc_c_option'
        const activeClassName = 'active'
        selectKeys.forEach((item, i) => {
            //  由组件级代理
            let parant = document.querySelector(`#${item}`)
            parant.onclick = function (e) {
                let list = parant.querySelectorAll(`.${defaultClassName}`)
                let ev = window.event || e;
                if (ev.target.nodeName === 'SPAN') {
                    for (let i = 0; i < list.length; i++) {
                        list[i].classList.remove(activeClassName)
                    }
                    ev.target.classList.add(activeClassName);
                    self.data[item] = ev.target.getAttribute('data-id')

                    // 副作用effects
                    // 1. 环评材料选择为无环保时，需要将环保附件上传栏隐藏
                    if (item === 'envReport') {
                        let _dom = document.querySelector('#envEnclosure')
                        if (parseInt(ev.target.getAttribute('data-id')) === 1) {
                            _dom.classList.add('hidden')
                        } else {
                            _dom.classList.remove('hidden')
                        }
                    }
                }
            }
        })
    }

    //  绑定上传环评附件事件
    bindUploadReportFileEvents() {
        const self = this
        const dom = document.querySelector('#envReportFile')
        const box = document.querySelector('#envReportFile-img-box')
        const img = document.querySelector('#envReportFile-img')
        dom.onclick = function () {
            Utils.File.actionSheet('请选择', ['相机', '相册'], function (index) {
                Utils.File.getPicture(self.profile.uploadImgType[index], function (res, err) {
                    if (res) {
                        self.envReportFile = res.data
                        if (res.data) {
                            img.src = res.data;
                            box.classList.remove('hidden')
                        } else {
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

    //  绑定土地信息与养殖信息折叠面板事件
    bindCollapseEvents() {
        let landInfoBox = document.querySelector('#landInfoBox')
        let landInfoCollapse = document.querySelector('#landInfo')
        let farmInfoBox = document.querySelector('#farmInfoBox')
        let farmInfoCollapse = document.querySelector('#farmInfo')

        farmInfoBox.onclick = function () {
            if (farmInfoCollapse.classList.contains('folder')) {
                farmInfoCollapse.classList.remove('folder')
                farmInfoBox.querySelector('.cl-cell_arrow').classList.add('rotate')
            } else {
                farmInfoCollapse.classList.add('folder')
                farmInfoBox.querySelector('.cl-cell_arrow').classList.remove('rotate')
            }
        }
        landInfoBox.onclick = function () {
            if (landInfoCollapse.classList.contains('folder')) {
                landInfoCollapse.classList.remove('folder')
                landInfoBox.querySelector('.cl-cell_arrow').classList.add('rotate')
            } else {
                landInfoCollapse.classList.add('folder')
                landInfoBox.querySelector('.cl-cell_arrow').classList.remove('rotate')
            }
        }
    }

    //  跳转至房产、车辆、家庭成员录入页
    bindEventsPageRouter() {
        document.querySelector('#familyInfo').onclick = function () {
            Utils.Router.openGuaranteeApplicationFamily()
        }
        document.querySelector('#houseInfo').onclick = function () {
            Utils.Router.openGuaranteeApplicationHouse()
        }
        document.querySelector('#carInfo').onclick = function () {
            Utils.Router.openGuaranteeApplicationCar()
        }
    }

    // 提交表单
    bindSubmitEvents() {
        const self = this
        const btn = document.querySelector('.cl_c_submit_btn')
        btn.onclick = function () {
            self.submitFormData()
        }
    }

    //  format 土地信息和养殖信息数据
    async submitFormData() {
        const {landType, farmType, envReport, livestockType, shedStructure, gtId, envReportFile, pcd} = this.data
        const farmsSize = document.querySelector('#scale').value
        const workshopCount = document.querySelector('#sheds').value
        const workshopArea = document.querySelector('#shedArea').value
        const workshopAddr = document.querySelector('#shedAddressDetail').value
        const formJSON = {
            gtId,
            landNature: landType,
            envDataType: envReport,
            farmsNature: livestockType,
            farmsCategory: farmType,
            farmsSize,
            workshopCount,
            workshopArea,
            workshopProvince: pcd.province.name,
            workshopProvinceCode: pcd.province.code,
            workshopCity: pcd.city.name,
            workshopCityCode: pcd.city.code,
            workshopCounty: pcd.district.name,
            workshopCountyCode: pcd.district.code,
            workshopAddr,
            workshopStruct: shedStructure
        }

        alert(JSON.stringify(formJSON))

        let isValidate = !Object.values(formJSON).some((item, i) => !item)
        // return
        if (isValidate) {
            // formJSON.envDataFileStream = envReportFile
            // test
            http.upload('/crpt-guarantee/gt/operate/save', {
                values: formJSON,
                files: {
                    envDataFileStream: envReportFile
                }
            }).then(function (ret) {
                if (ret.data.result === 'NO') {
                    api.toast({
                        msg: ret.data.info || '实名认证失败'
                    });
                } else {
                    openAuthResult('success');
                }
            }).catch(function (error) {
                api.toast({
                    msg: error.msg || '实名认证失败'
                });
                $api.removeCls($api.byId('next'), 'loading');
            });

            return


            const res = await this.postInsertOperate(formJSON)
            if (res.code === 200) {
                api.toast({
                    msg: '提交成功',
                    location: 'middle'
                })
                //  退回到上一页
            }
        }
    }
}

apiready = function () {
    let pageParam = api.pageParam || {};
    api.setStatusBarStyle({
        style: 'dark'
    });
    new PageController({pageParam}).main()
};
