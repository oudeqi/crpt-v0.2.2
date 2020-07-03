import http from './../../../http'

const service = {
  postQueryEBSOrders: (params) => {
    return http.post(`/crpt-order/order/hxd/query/warehouse/order/list`, { body: params })
  },
  postApply: (params) => {
    return http.post(`/crpt-credit/credit/hxd/apply/warehouse/order/list`, { body: params })
  }
}
export default service