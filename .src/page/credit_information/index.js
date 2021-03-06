import '../../app.css'
import './index.less'
import Utils from './../../utils'
import Service from './service'

/**
 * @author liyang
 * @desc 资料录入页
 * @class PageController类，需继承Service类
 */
class PageController extends Service {
    constructor(props) {
        super()
        //  统一管理数据model data
        this.data = {
            flowStatus: 0, // 0	无填写, 1 担保业务申请填写, 2 反担保人列表,3 文书送达地址, 4	其他附件上传
            gtId: '' // 担保申请id
        }
    }

    main(props) {
        this.initData()
    }

    async initData() {
        Utils.UI.showLoading()
        try {
            const res = await this.getQueryGuaranteeMain()
            const {data} = res
            this.data.flowStatus = data.flowStatus
            this.data.applyStatus = data.applyStatus
            this.data.gtId = data.gtId
            this.data.gtCreditId = data.gtCreditId
            //   审核中
            if(data.applyStatus === 2 && data.creditStatus === 1) {
                let submitBtn = document.querySelector('#submit')
                submitBtn.innerHTML = '审核中...'
                submitBtn.setAttribute('disabled', true)
                submitBtn.classList.add('disabled')
            }
        }catch(e) {
            Utils.UI.toast('服务超时')
        }
        Utils.UI.hideLoading()
        this.initUIModal()
        this.bindEvents()
    }

    initUIModal() {
        const self = this
        Array
            .from(document.querySelectorAll('.cl-cell_text'))
            .forEach((dom, i) => {
                let _index = parseInt(dom.getAttribute('data-index'))
                if (_index <= self.data.flowStatus) {
                    dom.classList.add('done')
                }
                if (_index === self.data.flowStatus + 1) {
                    dom.classList.add('next')
                }
            })
    }

    bindEvents() {
        this.bindRouterPage()
        this.bindSubmitEvents()
    }

    bindRouterPage() {
        const self = this
        Array
            .from(document.querySelectorAll('.cl-cell'))
            .forEach((dom, i) => {
                let domChild = dom.querySelector('.cl-cell_text')
                dom.onclick = function () {
                    if (true || domChild.classList.contains('done') || domChild.classList.contains('next')) {
                        Utils.Router[dom.getAttribute('data-router')]({
                            pageParam: {gtId: self.data.gtId, flowStatus: self.data.flowStatus, gtCreditId: self.data.gtCreditId}
                        })
                    } else {
                        api.toast({
                            msg: '请先完成上一步',
                            duration: 1000,
                            location: 'middle'
                        });
                    }
                }
            })
    }
    // 提交
    async bindSubmitEvents() {
        const self = this
        document.querySelector('#submit').onclick = async function () {
            // 未提交才可以修改
            if(self.data.applyStatus === 1) {
                Utils.UI.showLoading('提交中')
                try {
                    const res = await self.submitCreditStep({gtId: self.data.gtId})
                    Utils.UI.toast('提交成功')
                    window.location.reload()
                }catch(e) {
                    Utils.UI.toast(e.msg)
                }
                Utils.UI.hideLoading()
            }
        }
    }
}

apiready = function () {
    api.setStatusBarStyle({
        style: 'dark'
    })

    let pageParam = api.pageParam || {}
    let {id, type} = pageParam // '9939393'

    new PageController().main()

}
