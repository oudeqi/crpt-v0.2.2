import Utils from './../../utils'
import '../../app.css'
import './index.less'
import Service from './service'

/**
 * @authro liyang
 * @desc 担保业务申请表录入页Page 类
 * @class PageController类，需继承Service类
 */
class PageController extends Service {
    constructor(props) {
        super()
        //  所有表单域预置信息
        this.profile = {
            // upload参数
            uploadImgType: {
                0: 'camera',
                1: 'album'
            }
        }
        //  统一管理数据model data
        this.data = {
            gtId: props.pageParam.gtId,
            flowStatus: props.pageParam.flowStatus,
            gtCreditId: props.pageParam.gtCreditId,
            _cb: props.pageParam._cb,
            type: props.pageParam.type,
            houseList: [{
                houseNo: '',
                area: '',
                housePrice: '',
                addrDetail: '',
                addrProvince: '',
                addrProvinceCode: '',
                addrCity: '',
                addrCityCode: '',
                addrCounty: '',
                addrCountyCode: '',
                pictureId: ''
            }]
        }
    }

    //  执行函数
    main(props) {
        this.initData()
        this.bindEvents()
    }

    //  事件绑定入口
    bindEvents() {
        this.bindAddEvents()
        this.bindDelEvents()
        this.bindSubmitEvents()
    }

    async initData() {
        Utils.UI.showLoading('加载中')
        try {
            const res = await this.getGuaranteeHouseList({
                gtId: this.data.gtId
            })
            this.data.houseList = res.data.length > 0 ? res.data.map((item, i) => {
                return {
                    ...item,
                    pictureId: item.pictureId || ''
                }
            }) : [{
                houseNo: '',
                area: '',
                housePrice: '',
                addrDetail: '',
                addrProvince: '',
                addrProvinceCode: '',
                addrCity: '',
                addrCityCode: '',
                addrCounty: '',
                addrCountyCode: '',
                pictureId: ''
            }]
        } catch (e) {
            Utils.UI.toast('服务超时')
        }
        this.compilerTemplate(this.data.houseList)
        this.bindCityPickerEvents()
        Utils.UI.hideLoading()
    }

    //  绑定add事件
    bindAddEvents() {
        const self = this
        const addBtn = document.querySelector('#add-btn')
        addBtn.onclick = function () {
            self.searchAllData()
            self.data.houseList.push({
                houseNo: '',
                area: '',
                housePrice: '',
                addrDetail: '',
                addrProvince: '',
                addrProvinceCode: '',
                addrCity: '',
                addrCityCode: '',
                addrCounty: '',
                addrCountyCode: '',
                pictureId: ''
            })
            self.compilerTemplate((self.data.houseList))
            self.bindCityPickerEvents()
        }
    }

    // 绑定删除事件
    bindDelEvents() {
        const self = this
        document.querySelector('#credit-list').onclick = function (e) {
            let ev = window.event || e;
            if (ev.target.classList.contains('del')) {
                //  删除前需将model-tree检出，防止数据直接被抹除
                self.searchAllData()
                let index = ev.target.getAttribute('data-index')
                self.data.houseList.splice(index, 1)
                self.compilerTemplate(self.data.houseList)
                self.bindCityPickerEvents()
            }
        }
    }

    // 检索出当前所有填充在input中的model-tree，防止删除或新增时，将未保存的数据抹掉
    searchAllData() {
        const self = this
        const newHouseList = self.data.houseList.map((item, i) => {
            return {
                ...item,
                houseNo: document.querySelector(`#houseNo_${i}`).value,
                housePrice: Number(document.querySelector(`#housePrice_${i}`).value),
                area: document.querySelector(`#area_${i}`).value,
                addrDetail: document.querySelector(`#addrDetail_${i}`).value
            }
        })
        this.data.houseList = newHouseList
    }

    // 绑定city picker组件
    bindCityPickerEvents() {
        const self = this
        Array.from(document.querySelectorAll('.fc_c_city_label')).forEach((dom, i) => {
            dom.onclick = function() {
                Utils.UI.setCityPicker({
                    success: selected => {
                        let [province, city, district] = selected
                        // const index = dom.getAttribute('data-index')
                        Object.assign(self.data.houseList[i], {
                            addrProvince: province.name,
                            addrProvinceCode: province.id,
                            addrCity: city.name,
                            addrCityCode: city.id,
                            addrCounty: district.name,
                            addrCountyCode: district.id
                        })
                        dom.innerHTML = `${province.name} ${city.name} ${district.name}`
                        dom.classList.add('selected')
                    },
                    data: 'widget://res/city.json',
                })
            }
        })
    }

    //  绑定提交房产信息
    bindSubmitEvents() {
        const self = this
        document.querySelector('#save-btn').onclick = async function () {
            self.searchAllData()
            // 校验是否还有未填写的数据
            let isValidate = !self.data.houseList.some((item, i) => {
                return !item.houseNo || !item.housePrice || !item.area || !item.addrDetail || !item.addrProvince
            })
            if (!isValidate) {
                Utils.UI.toast('还有信息未填完')
                return
            }
            Utils.UI.showLoading('提交中')
            try {
                const res = await self.postGuaranteeHouseList({
                    type: 1,
                    gtId: self.data.gtId,
                    gtCreditId: self.data.gtCreditId,
                    houseList: self.data.houseList
                })
                Utils.Router.closeCurrentWinAndRefresh({
                    winName: 'html/guarantee_application_index/index',
                    script: self.data._cb || 'window.location.reload'
                })
            } catch (e) {
                Utils.UI.toast('服务超时')
            }
            Utils.UI.hideLoading()
        }
    }

    // 编译html模板
    compilerTemplate(list) {
        const _html = list.reduce((prev, item, i) => {
            return prev + `<div class="cl-cell">
        <div class="cl-cell_box cl_h_bd">
            <div class="cl-cell_text single">
                <span class="clt_main" >房产<b>${i + 1}</b></span>
                <a class="del" data-index="${i}">删除</a>
            </div>
        </div>

        <div class="form-body">
            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">房产证号</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="text"
                               id="houseNo_${i}" placeholder="请输入" data-index="${i}" value="${item.houseNo || ''}"/>
<!--                        <div class="fc_unit icon_house_scan" id="OCRBtn_${i}" data-index="${i}">hi</div>-->
                    </div>
                </div>
            </div>

            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">建筑面积</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="number" pattern="[0-9/.]*" id="area_${i}" placeholder="请输入" data-index="${i}" value="${item.area}">
                        <div class="fc_unit">平方米</div>
                    </div>
                </div>
            </div>

            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">房产价值</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="number" pattern="[0-9/.]*"
                               id="housePrice_${i}" placeholder="请输入" data-index="${i}" value="${item.housePrice || ''}" />
                        <div class="fc_unit">万元</div>
                    </div>
                </div>
            </div>

             <div class="form-cell_shell top">
                <div class="fc_label">
                    <span class="fc_span">房产地址</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common bd">
                        <div class="fc_c_city" >
                            <span id="address_${i}" class="fc_c_city_label ${item.addrProvince && 'selected'}" data-index="${i}">
                            ${item.addrProvince
                ? item.addrProvince + ' ' + item.addrCity + ' ' + item.addrCounty
                : '选择 城市/区域'}
                            </span>
                        </div>
                    </div>
                    <div class="fc_c_common">
                        <input class="fc_c_input" id="addrDetail_${i}" value="${item.addrDetail || ''}" type="text" placeholder="详细地址" />
                    </div>
                </div>
            </div>
        </div>
    </div>`
        }, '')
        document.querySelector('#credit-list').innerHTML = _html
        // alert(_html)
    }
}

apiready = function () {
    let pageParam = api.pageParam || {};
    api.setStatusBarStyle({
        style: 'dark'
    });
    new PageController({pageParam}).main()
};
