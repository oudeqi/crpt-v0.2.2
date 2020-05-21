import Utils from './../../utils'
import '../../app.css'
import './index.less'
import {http, baseUrl} from "../../config";
import Service from './service'
import Rolldate from 'rolldate'

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
                    {"name": "一般耕地", "id": 1},
                    {"name": "基本农田", "id": 2},
                    {"name": "山地", "id": 3},
                    {"name": "林地", "id": 4},
                    {"name": "草地", "id": 5}
                ],
                farmType: [
                    {"name": "鸡", "id": 1},
                    {"name": "鸭", "id": 2},
                    {"name": "猪", "id": 3}
                ]
            },
            //  select类组件json
            selects: {
                envReport: [
                    {"name": "无环评", "id": 1},
                    {"name": "环评备案", "id": 2},
                    {"name": "环评报告", "id": 3}
                ],
                livestockType: [
                    {"name": "自有", "id": 1},
                    {"name": "租赁", "id": 2}
                ],
                shedStructure: [
                    {"name": "墙体结构", "id": 1},
                    {"name": "立柱式", "id": 2}
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
            gtCreditId: props.gtCreditId,
            isInsert: true,
            farmType: 1,
            landType: 1,
            envReport: 1,
            shedStructure: 1,
            livestockType: 1,
            maturityYear: '',
            pcd: {
                province: {},
                city: {},
                district: {}
            }
        }
    }

    //  执行函数
    main() {
        Utils.UI.showLoading('加载中...')
        this.initData({
            callback: () => {
                Utils.UI.hideLoading();
            }
        })
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

        this.bindDateEvents()
    }

    async initData({callback}) {
        const self = this
        //  1. 刷房产信息、车辆信息、家庭成员信息子表状态
        try {
            const guaranteeRes = await this.getQueryGuaranteeMain()
            if (guaranteeRes.data) {
                const {houseFillStatus, carFillStatus, socialFillStatus} = guaranteeRes.data
                Boolean(houseFillStatus) && document.querySelector('#houseInfoStatus').classList.add('done')
                Boolean(carFillStatus) && document.querySelector('#carInfoStatus').classList.add('done')
                Boolean(socialFillStatus) && document.querySelector('#familyInfoStatus').classList.add('done')
            }
        } catch (e) {
            Utils.UI.toast('服务超时')
        }

        //  2. 查经营信息中土地信息和养殖信息子表以及接口类型
        const gtId = this.data.gtId
        const gtCreditId = this.data.gtCreditId
        let operateRes
        try {
            operateRes = await this.getQueryOperate({gtId})
            // 3. 刷主表土地信息和养殖信息填写状态和字段
            this.data.isInsert = false
            this.data.operateId = operateRes.data.operateId
            document.querySelector('#landInfoStatus').classList.add('done')
            document.querySelector('#farmInfoStatus').classList.add('done')

            // key: 土地性质
            const landTypeProfile = this.profile.pickers.landType.find((item, i) => operateRes.data.landNature === item.id)
            if (landTypeProfile) {
                document.querySelector('#landType').innerHTML = landTypeProfile.name
                this.data.landType = landTypeProfile.id
            }

            //  key: 环评材料
            const envReportProfile = this.profile.selects.envReport.find((item, i) => operateRes.data.envDataType === item.id)
            if (envReportProfile) {
                Array
                    .from(document
                        .querySelector('#envReport')
                        .querySelectorAll('.fc_c_option'))
                    .forEach((item, i) => {
                        if (Number(item.getAttribute('data-id')) === envReportProfile.id) {
                            self.data.envReport = envReportProfile.id
                            item.classList.add('active')
                        } else {
                            item.classList.remove('active')
                        }
                    })
            }

            // key: 环评附件
            if (envReportProfile && envReportProfile.id !== 1) {
                const imgDom = document.querySelector('#envReportFile-img')
                this.data.envDataFileId = operateRes.data.envDataFileId
                imgDom.src = `${baseUrl}/crpt-file/file/download/${operateRes.data.envDataFileId}`
                imgDom.classList.remove('hidden')
                document.querySelector('#envEnclosure').classList.remove('hidden')
            }

            //  key: 养殖场性质
            const livestockTypeProfile = this.profile.selects.livestockType.find((item, i) => operateRes.data.farmsNature === item.id)
            if (livestockTypeProfile) {
                Array
                    .from(document
                        .querySelector('#livestockType')
                        .querySelectorAll('.fc_c_option'))
                    .forEach((item, i) => {
                        if (Number(item.getAttribute('data-id')) === livestockTypeProfile.id) {
                            self.data.livestockType = livestockTypeProfile.id
                            item.classList.add('active')
                        } else {
                            item.classList.remove('active')
                        }
                    })
            }

            //  租赁到期时间
            if (operateRes.data.maturityYear) {
                self.data.maturityYear = operateRes.data.maturityYear
                const dom = document.querySelector('#maturityYear')
                if(operateRes.data.farmsNature === 2) {
                    dom.classList.remove('hidden')
                    document.querySelector('#maturityYearDateString').innerHTML = operateRes.data.maturityYear
                }
            }

            // key: 养殖品种
            const farmTypeProfile = this.profile.pickers.farmType.find((item, i) => operateRes.data.farmsCategory === item.id)
            if (farmTypeProfile) {
                document.querySelector('#farmType').innerHTML = farmTypeProfile.name
                this.data.farmType = farmTypeProfile.id
            }

            // key: 养殖规模
            const scale = operateRes.data.farmsSize
            this.data.scale = scale
            document.querySelector('#scale').value = scale
            document.querySelector('#scaleUnit').innerHTML = this.data.farmType === 3 ? '头' : '万只'

            // key: 棚舍数量
            const sheds = operateRes.data.workshopCount
            this.data.sheds = sheds
            document.querySelector('#sheds').value = sheds

            // key: 棚舍面积
            const shedArea = operateRes.data.workshopArea
            this.data.shedArea = shedArea
            document.querySelector('#shedArea').value = shedArea

            // key: 棚舍地址
            const {workshopProvince, workshopProvinceCode, workshopCity, workshopCityCode, workshopCounty, workshopCountyCode} = operateRes.data
            this.data.pcd = {
                province: {
                    name: workshopProvince,
                    code: workshopProvinceCode,
                },
                city: {
                    name: workshopCity,
                    code: workshopCityCode,
                },
                district: {
                    name: workshopCounty,
                    code: workshopCountyCode
                }
            }
            document.querySelector(`#shedAddress`).innerHTML = `<span class="fc_c_city_label selected">${workshopProvince} ${workshopCity} ${workshopCounty}</span>`

            // key: 棚舍面积
            const shedAddressDetail = operateRes.data.workshopAddr
            this.data.shedArea = shedAddressDetail
            document.querySelector('#shedAddressDetail').value = shedAddressDetail

            // key: 棚设结构
            const shedStructureProfile = this.profile.selects.shedStructure.find((item, i) => operateRes.data.workshopStruct === item.id)
            if (shedStructureProfile) {
                Array
                    .from(document
                        .querySelector('#shedStructure')
                        .querySelectorAll('.fc_c_option'))
                    .forEach((item, i) => {
                        if (Number(item.getAttribute('data-id')) === shedStructureProfile.id) {
                            self.data.shedStructure = shedStructureProfile.id
                            item.classList.add('active')
                        } else {
                            item.classList.remove('active')
                        }
                    })
            }
        } catch (err) {
            //  3005 担保运营数据不存在，则提交按钮应为insert接口，同时土地信息和养殖信息置灰
            if (err.code === 3005) {
                this.data.isInsert = true
            } else {
                Utils.UI.toast(err.msg)
            }
        }
        callback && callback()
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
                    }maturityYear
                    // 2. 养殖场性质为租赁时，展示租赁日期
                    if (item === 'livestockType') {
                        let _dom = document.querySelector('#maturityYear')
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
                        self.data.envReportFile = res.data
                        if (res.data) {
                            img.src = res.data;
                            box.classList.remove('hidden')
                            Utils.UI.toast('上传成功')
                        } else {
                            Utils.UI.toast('未上传成功')
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
            Utils.Router.openGuaranteeApplicationFamily({pageParam: api.pageParam})
        }
        document.querySelector('#houseInfo').onclick = function () {
            Utils.Router.openGuaranteeApplicationHouse({pageParam: api.pageParam})
        }
        document.querySelector('#carInfo').onclick = function () {
            Utils.Router.openGuaranteeApplicationCar({pageParam: api.pageParam})
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

    //  绑定租赁日期选择
    bindDateEvents() {
        const self = this
        const rd = new Rolldate({
            el: '#maturityYearDateString',
            format: 'YYYY',
            beginYear: 2020,
            endYear: 2030,
            minStep:1,
            lang:{title:'选择租赁到期时间'},
            trigger:'tap',
            init: function() {
                console.log('插件开始触发');
            },
            moveEnd: function(scroll) {
                console.log('滚动结束');
            },
            confirm: function(date) {
                self.data.maturityYear = date
                console.log('确定按钮触发');
            },
            cancel: function() {
                console.log('插件运行取消');
            }
        })
        // rd.show();
        // rd.hide();
    }
    //  format 土地信息和养殖信息数据
    async submitFormData() {
        const self = this
        const {landType, farmType, envReport, livestockType, shedStructure, gtId, envReportFile, pcd, maturityYear} = this.data
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
            maturityYear,
            workshopStruct: shedStructure
        }

        let isValidate = !Object.values(formJSON).some((item, i) => !item)
        if (isValidate) {
            Utils.UI.showLoading('保存中...')
            let res = null
            try {
                if (self.data.isInsert) {
                    res = await this.postInsertOperate(formJSON, {envDataFileStream: envReportFile})
                    //  第一次插入经营新后，存储返回的operateId
                    self.data.operateId = res.data
                    self.data.isInsert = false
                } else {
                    Object.assign(formJSON, {operateId: self.data.operateId})
                    res = await this.postUpdateOperate(formJSON, {envDataFileStream: envReportFile})
                }
                Utils.UI.toast('提交成功')
            } catch (e) {
                Utils.UI.hideLoading()
                Utils.UI.toast(e.msg)
            }
            Utils.UI.hideLoading()
        } else {
            Utils.UI.toast('还有信息未填入')
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
