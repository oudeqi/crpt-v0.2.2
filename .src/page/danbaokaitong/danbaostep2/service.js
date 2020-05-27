import { http } from '../../../config'

export default class Service {
    constructor() {
        this.ajaxUrls = {
            queryMainUrl: '/crpt-guarantee/gt/apply/query',
            submitCreditStepUrl: '/crpt-guarantee/gt/apply/submit'
        }
    }
    getQueryGuaranteeMain() {
        return http.get(this.ajaxUrls.queryMainUrl, null, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            },
            timeout: 3000
        })
    }
    submitCreditStep(params) {
        return http.get(this.ajaxUrls.submitCreditStepUrl, {values: params}, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            },
            timeout: 3000
        })
    }
}
