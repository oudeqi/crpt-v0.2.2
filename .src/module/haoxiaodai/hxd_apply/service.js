import http from './../../../http'

const service = {
  getProductInfo: (params) => {
    return http.get(`/crpt-credit/credit/jf/product/detail`, { values: params })
  },
  postSignJF: (params) => {
    return http.post(`/crpt-credit/credit/jf/apply/sign?productId=${params.productId}`, null, {
      timeout: 10
    })
  }
}
export default service