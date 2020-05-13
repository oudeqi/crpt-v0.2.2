import { http } from './../../config'

export default class Service {
    constructor() {
        this.ajaxUrls = {
            queryGuaranteeMainUrl: '/crpt-guarantee/gt/apply/query'
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
}
