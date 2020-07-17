import http from './../../../http'

const service = {
  postQueryEBSOrders: (params) => {
    return http.post(`/crpt-order/order/hxd/query/warehouse/order/list`, { body: params })
  },
  postCustApply: (params) => {
    return http.post(`/crpt-credit/credit/hxd/check/cust/apply/order/list`, { body: params })
  }
}
export default service