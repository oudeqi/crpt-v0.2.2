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
            pickers: {
                relation: [
                    {name: '配偶', id: 1},
                    {name: '父母', id: 2},
                    {name: '子女', id: 3}
                ]
            },
            // upload参数
            uploadImgType: {
                0: 'camera',
                1: 'album'
            },
            remap: {
                relation: {
                    1: '配偶',
                    2: '父母',
                    3: '子女'
                }
            }
        }
        //  统一管理数据model data
        this.data = {
            gtId: props.pageParam.gtId,
            flowStatus: props.pageParam.flowStatus,
            gtCreditId: props.pageParam.gtCreditId,
            _cb: props.pageParam._cb,
            type: props.pageParam.type,
            socialrefList: [{
                name: '',
                phone: '',
                income: '',
                type: '',
                occupation: '',
                workCompany: ''
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
            const res = await this.getGuaranteeFamilyList({
                gtId: this.data.gtId
            })
            this.data.socialrefList = res.data.length > 0 ? res.data : [{
                name: '',
                phone: '',
                income: '',
                type: '',
                occupation: '',
                workCompany: ''
            }]
        } catch (e) {
            Utils.UI.toast('服务超时')
        }
        this.compilerTemplate(this.data.socialrefList)
        this.bindPickerEvents()
        Utils.UI.hideLoading()
    }

    //  绑定add事件
    bindAddEvents() {
        const self = this
        const addBtn = document.querySelector('#add-btn')
        addBtn.onclick = function () {
            self.searchAllData()
            self.data.socialrefList.push({
                name: '',
                phone: '',
                income: '',
                type: '',
                occupation: '',
                workCompany: ''
            })
            self.compilerTemplate((self.data.socialrefList))
            self.bindPickerEvents()
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
                self.data.socialrefList.splice(index, 1)
                self.compilerTemplate(self.data.socialrefList)
                self.bindPickerEvents()
            }
        }
    }

    // 检索出当前所有填充在input中的model-tree，防止删除或新增时，将未保存的数据抹掉
    searchAllData() {
        const self = this
        const newSocialrefList = self.data.socialrefList.map((item, i) => {
            return {
                ...item,
                name: document.querySelector(`#name_${i}`).value,
                phone: Number(document.querySelector(`#phone_${i}`).value),
                income: document.querySelector(`#income_${i}`).value,
                occupation: document.querySelector(`#occupation_${i}`).value,
                workCompany: document.querySelector(`#workCompany_${i}`).value
            }
        })
        this.data.socialrefList = newSocialrefList
    }

    // 绑定所有Picker组件事件
    bindPickerEvents() {
        const self = this
        Array.from(document.querySelectorAll('.fc_c_picker')).forEach((dom, i) => {
            dom.onclick = function () {
                Utils.UI.setPicker({
                    success: selected => {
                        let value = selected[0]
                        self.data.socialrefList[i].type = Number(value.id)
                        dom.innerHTML = value.name
                    },
                    data: self.profile.pickers.relation
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
            let isValidate = !self.data.socialrefList.some((item, i) => {
                return !item.name || !item.phone || !item.income || !item.type || !item.occupation || !item.workCompany
            })
            if (!isValidate) {
                Utils.UI.toast('还有信息未填完')
                return
            }
            // 校验手机号是否合法
            isValidate = self.data.socialrefList.some((item,i) => {
                return !/1\d{10}/.test(item.phone)
            })
            if(isValidate) {
                Utils.UI.toast('手机号格式有误哦')
                return
            }

            Utils.UI.showLoading('提交中')
            try {
                const res = await self.postGuaranteeFamilyList({
                    type: self.data.type || 1,
                    gtId: self.data.gtId,
                    gtCreditId: self.data.gtCreditId,
                    socialrefList: self.data.socialrefList
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
        const self = this
        const _html = list.reduce((prev, item, i) => {
            return prev + `<div class="cl-cell">
        <div class="cl-cell_box cl_h_bd">
            <div class="cl-cell_text single">
                <span class="clt_main" >家庭成员<b>${i + 1}</b></span>
                <a class="del" data-index="${i}">删除</a>
            </div>
        </div>

        <div class="form-body">
            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">姓名</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="text"
                               id="name_${i}" placeholder="请输入" data-index="${i}" value="${item.name || ''}"/>
                    </div>
                </div>
            </div>

            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">联系电话</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="tel"  id="phone_${i}" placeholder="请输入" data-index="${i}" value="${item.phone || ''}">
                    </div>
                </div>
            </div>

            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">每年收入</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="number" pattern="[0-9/.]*"
                               id="income_${i}" placeholder="请输入" data-index="${i}" value="${item.income || ''}" />
                        <div class="fc_unit">万元</div>
                    </div>
                </div>
            </div>

             <div class="form-cell_shell">
                <div class="fc_label">
                    <span class="fc_span">亲属关系</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <div id="type_${i}" class="fc_c_picker">${item.type ? self.profile.remap.relation[item.type] : '<span class="placeholder">请选择</span>'}</div>
                    </div>
                </div>
            </div>

             <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">职业</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="text"
                               id="occupation_${i}" placeholder="请输入" data-index="${i}" value="${item.occupation || ''}"/>
                    </div>
                </div>
            </div>

            <div class="form-cell_shell" data-index="${i}">
                <div class="fc_label">
                    <span class="fc_span">工作单位</span>
                </div>
                <div class="fc_content">
                    <div class="fc_c_common">
                        <input class="fc_c_input" type="text"
                               id="workCompany_${i}" placeholder="请输入" data-index="${i}" value="${item.workCompany || ''}"/>
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
