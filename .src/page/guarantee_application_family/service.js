import {http} from './../../config'

export default class Service {
    constructor() {
        this.ajaxUrls = {
            postGuaranteeFamilyUrl: '/crpt-guarantee/guarantor/socialref/insert',
            getGuaranteeFamilyUrl: '/crpt-guarantee/guarantor/socialref/query'
        }
    }

    postGuaranteeFamilyList(params) {
        return http.post(this.ajaxUrls.postGuaranteeFamilyUrl, {body: params}, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46',
                'Content-Type': 'application/json'
            },
            timeout: 3000
        })
    }

    getGuaranteeFamilyList(params) {
        return http.get(this.ajaxUrls.getGuaranteeFamilyUrl, {values: params}, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            },
            timeout: 3000
        })
    }
}
