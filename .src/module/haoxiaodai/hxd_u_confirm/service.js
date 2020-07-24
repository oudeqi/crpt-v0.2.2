import http from './../../../http'

const service = {
  postConfirmOrders: (params) => {
    return http.post(`/crpt-order/order/hxd/query/confirm/warehouse/order/list`, { body: params })
  },
  postApply: (params) => {
    return http.post(`/crpt-credit/credit/hxd/apply/warehouse/order/list`, { body: params }, {
      timeout: 60
    })
  },
  postQueryApply: (params) => {
    return http.post(`/crpt-credit/credit/hxd/query/warehouse/order/apply/info`, { body: params })
  },
  postContractList: () => {
    return http.post(`/crpt-credit/credit/hxd/query/prepay/warehouse/contract/list`, { body: params })
  },

}
export default service