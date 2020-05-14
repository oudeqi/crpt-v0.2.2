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
            this.data.gtId = data.gtId
            this.data.gtCreditId = data.gtCreditId
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
    }

    bindRouterPage() {
        const self = this
        Array
            .from(document.querySelectorAll('.cl-cell_text'))
            .forEach((dom, i) => {
                dom.onclick = function () {
                    if (dom.classList.contains('done') || dom.classList.contains('next')) {
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
}

apiready = function () {
    api.setStatusBarStyle({
        style: 'dark'
    })

    let pageParam = api.pageParam || {}
    let {id, type} = pageParam // '9939393'

    new PageController().main()

}
