import http from './../../http'

const service = {
  getQuota: () => {
    return http.get(`/crpt-credit/credit/credit/amount`)
  },
  getQuotaList: () => {
    return http.get(`/crpt-credit/credit/credit/mine/productList`)
  }
}
export default service