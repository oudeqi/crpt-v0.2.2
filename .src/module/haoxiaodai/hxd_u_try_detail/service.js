import http from './../../../http'

const service = {
  postBankInterest: (params) => {
    return http.get(`/crpt-credit/credit/hxd/query/bank/interest`, {values: params})
  },
  postCalculatorPlan: (params) => {
    return http.post(`/crpt-credit/credit/hxd/calculator/for/apply`, { body: params })
  }
}
export default service