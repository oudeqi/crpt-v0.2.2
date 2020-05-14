import {http} from './../../config'

export default class Service {
    constructor() {
        this.ajaxUrls = {
            postGuaranteeHouseUrl: '/crpt-guarantee/guarantor/house/insert',
            getGuaranteeHouseUrl: '/crpt-guarantee/guarantor/house/query'
        }
    }

    postGuaranteeHouseList(params) {
        return http.post(this.ajaxUrls.postGuaranteeHouseUrl, {body: params}, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46',
                'Content-Type': 'application/json'
            },
            timeout: 3000
        })
    }

    getGuaranteeHouseList(params) {
        return http.get(this.ajaxUrls.getGuaranteeHouseUrl, {values: params}, {
            headers: {
                token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            },
            timeout: 3000
        })
    }
}
