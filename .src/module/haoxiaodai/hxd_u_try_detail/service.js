import http from './../../../http'

const service = {
  postBankInterest: (params) => {
    return http.post(`/crpt-credit/credit/hxd/query/bank/interest`, {body: params})
  },
  postCalculatorPlan: (params) => {
    return http.get(`/crpt-credit/credit/hxd/calculator/for/apply`, { values: params })
  }
}
export default service