import http from './../../../http'

const service = {
  getProductInfo: (params) => {
    return http.get(`/crpt-credit/credit/jf/company/completeInfo`, { body: params })
  },
  postSignJF: (params) => {
    return http.post(`/crpt-credit/credit/jf/apply/sign`, { values: params })
  }
}
export default service