import { http } from './../../config'

export default class Service {
  constructor() {
    this.ajaxUrls = {
      queryGuaranteeMainUrl: '/crpt-guarantee/gt/apply/query',
      postGuaranteeFamilyUrl: '/crpt-guarantee/guarantor/socialref/insert',
      getGuaranteeFamilyUrl: '/crpt-guarantee/guarantor/socialref/query'
    }
  }
  getQueryGuaranteeMain() {
    return http.get(this.ajaxUrls.queryGuaranteeMainUrl, null, {
      // headers: {
      //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
      // },
      timeout: 3000
    })
  }
  postGuaranteeFamilyList(params) {
    return http.post(this.ajaxUrls.postGuaranteeFamilyUrl, { body: params }, {
      // headers: {
      //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46',
      //     'Content-Type': 'application/json'
      // },
      timeout: 3000
    })
  }

  getGuaranteeFamilyList(params) {
    return http.get(this.ajaxUrls.getGuaranteeFamilyUrl, { values: params }, {
      // headers: {
      //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
      // },
      timeout: 3000
    })
  }
}
