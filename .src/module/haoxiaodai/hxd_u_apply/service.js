import http from './../../../http'

const service = {
  postQueryEBSOrders: (params) => {
    return http.post(`/crpt-order/order/hxd/query/warehouse/order/list`, { body: params })
  },
  postSignJF: (params) => {
    return http.get(`/crpt-order/crpt-credit/credit/jf/apply/sign`, { values: params })
  }
}
export default service