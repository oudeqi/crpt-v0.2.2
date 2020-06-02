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
            carList: [{carNo: '', carPrice: '', brand: '', pictureId: ''}]
        }
    }

    //  执行函数
    async main(props) {
        this.initData()
        this.bindEvents()
    }

    //  事件绑定入口
    bindEvents() {
        this.bindAddEvents()
        this.bindDelEvents()
        this.bindSubmitEvents()
        this.bindOCREvents()
    }

    async initData() {
        Utils.UI.showLoading('加载中')
        try {
            const res = await this.getGuaranteeCarList({
                gtId: this.data.gtId
            })
            this.data.carList = res.data.length > 0 ? res.data.map((item, i) => {
                return {
                    ...item,
                    pictureId: item.pictureId || ''
                }
            }) : [{carNo: '', carPrice: '', brand: '', pictureId: ''}]
        } catch (e) {
            Utils.UI.toast('服务超时')
        }
        this.compilerTemplate(this.data.carList)
        Utils.UI.hideLoading('加载中')
    }

    //  绑定add事件
    bindAddEvents() {
        const self = this
        const addBtn = document.querySelector('#add-btn')
        addBtn.onclick = function () {
            self.searchAllData()
            self.data.carList.push({
                carNo: '',
                carPrice: '',
                brand: '',
                pictureId: ''
            })
            self.compilerTemplate((self.data.carList))
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
                self.data.carList.splice(index, 1)
                self.compilerTemplate(self.data.carList)
            }
        }
    }

    // 检索出当前所有填充在input中的model-tree，防止删除或新增时，将未保存的数据抹掉
    searchAllData() {
        const self = this
        const newCarList = self.data.carList.map((item, i) => {
            return {
                ...item,
                carNo: document.querySelector(`#carNo_${i}`).value,
                carPrice: Number(document.querySelector(`#carPrice_${i}`).value),
                brand: document.querySelector(`#brand_${i}`).value
            }
        })
        this.data.carList = newCarList
    }

    //  绑定提交车辆信息
    bindSubmitEvents() {
        const self = this
        document.querySelector('#save-btn').onclick = async function () {
            self.searchAllData()
            // 校验是否还有未填写的数据
            let isValidate = !self.data.carList.some((item, i) => {
                return !item.carNo || !item.carPrice || !item.brand
            })
            if (!isValidate) {
                Utils.UI.toast('还有信息未填完')
                return
            }
            Utils.UI.showLoading('提交中')
            try {
                const res = await self.postGuaranteeCarList({
                    type: self.data.type || 1,
                    gtId: self.data.gtId,
                    gtCreditId: self.data.gtCreditId,
                    carList: self.data.carList
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

    // 绑定ocr
    bindOCREvents() {
        const self = this
        document.querySelector('#car-page').onclick = function (e) {
            let ev = window.event || e;
            if (ev.target.classList.contains('icon_house_scan')) {
                const _index = ev.target.getAttribute('data-index')
                // ocr传图
                Utils.File.actionSheet('请选择', ['相机', '相册'], function (index) {
                    Utils.File.getPicture(self.profile.uploadImgType[index], async function (res, err) {
                        if (res) {
                            let fileStream = res.data
                            Utils.UI.showLoading('正在识别中...')
                            try {
                                const response = await Utils.OCR.Baidu.CarVerify({carFile: fileStream});
                                if (response.code === 200) {
                                    // 先检出数据
                                    self.searchAllData()
                                    const data = response.data
                                    // self.data.carList.splice(index, 1)
                                    const {carNo, carBrand} = data
                                    self.data.carList[_index].carNo = carNo
                                    self.data.carList[_index].brand = carBrand
                                    self.compilerTemplate(self.data.carList)

                                    // 后台保存上传的附件
                                    try {
                                        const attachRes = await self.saveAttachment({gtId: self.data.gtId}, {pictureFile: fileStream})
                                        if(attachRes.code === 200) {
                                            const pictureId = attachRes.data.pictureId
                                            self.data.carList[_index].pictureId = pictureId
                                        }
                                    } catch (e) {

                                    }
                                } else {
                                    Utils.UI.toast(response.msg)
                                }
                            } catch (e) {

                            }
                            Utils.UI.hideLoading()
                        }
                    })
                })
                // self.searchAllData()
                // let index = ev.target.getAttribute('data-index')
                // self.data.carList.splice(index, 1)
                // self.compilerTemplate(self.data.carList)
            }
        }
    }

    // 编译html模板
    compilerTemplate(list) {
        const _html = list.reduce((prev, item, i) => {
            return prev + `<div class="cl-cell">
        <div class="cl-cell_box cl_h_bd">
            <div class="cl-cell_text single">
                <span class="clt_main" >车辆<b>${i + 1}</b></span>
                <a class="del" data-index="${i}">删除</a>
            </div>
        </div>

        <div class="form-body">
            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">车辆号牌</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="text" id="carNo_${i}" placeholder="请输入" data-index="${i}" value="${item.carNo}"/>
                        <div class="fc_unit icon_house_scan" id="carOCRBtn_${i}" data-index="${i}">hi</div>
                    </div>
                </div>
            </div>

            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">车辆品牌</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="text" id="brand_${i}" placeholder="请输入" data-index="${i}" value="${item.brand}">
                    </div>
                </div>
            </div>

            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">车辆价值</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="number" pattern="[0-9/.]*"
                               id="carPrice_${i}" placeholder="请输入" data-index="${i}" value="${item.carPrice}" />
                        <div class="fc_unit">万元</div>
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
