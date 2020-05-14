import {http} from './../../config'

export default class Service {
    constructor() {
        this.ajaxUrls = {
            postGuaranteeCarUrl: '/crpt-guarantee/guarantor/car/insert',
            getGuaranteeCarUrl: '/crpt-guarantee/guarantor/car/query'
        }
    }

    postGuaranteeCarList(params) {
        return http.post(this.ajaxUrls.postGuaranteeCarUrl, {body: params}, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46',
                'Content-Type': 'application/json'
            },
            timeout: 3000
        })
    }

    getGuaranteeCarList(params) {
        return http.get(this.ajaxUrls.getGuaranteeCarUrl, {values: params}, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            },
            timeout: 3000
        })
    }
}
