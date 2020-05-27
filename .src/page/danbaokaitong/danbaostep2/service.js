import { http } from '../../../config'

export default class Service {
    constructor() {
        this.ajaxUrls = {
            queryMainUrl: '/crpt-guarantee/gt/apply/query',
            submitCreditStepUrl: '/crpt-guarantee/gt/apply/submit'
        }
    }
    getQueryGuaranteeMain() {
        return http.get(this.ajaxUrls.queryMainUrl)
    }
    submitCreditStep(params) {
        return http.get(this.ajaxUrls.submitCreditStepUrl, {values: params})
    }
}
