import { http } from './../../config'

export default class Service {
    constructor() {
        this.ajaxUrls = {
            queryGuaranteeMainUrl: '/crpt-guarantee/gt/apply/query',
            queryOperateUrl: '/crpt-guarantee/gt/operate/query',
            insertOperateUrl: '/crpt-guarantee/gt/operate/save'
        }
    }
    getQueryGuaranteeMain() {
        return http.get(this.ajaxUrls.queryGuaranteeMainUrl, null, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            },
            timeout: 3000
        })
    }
    getQueryOperate(params) {
        return http.get(this.ajaxUrls.queryOperateUrl, {values: params}, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            },
            timeout: 3000
        })
    }
    postInsertOperate(params) {
        return http.post(this.ajaxUrls.queryOperateUrl, {values: params}, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            },
            timeout: 3000
        })
    }
}
