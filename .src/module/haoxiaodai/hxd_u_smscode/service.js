import http from '../../../http'

const service = {
  postSendSMSCode: (params) => {
    return http.post(`/crpt-credit/credit/hxd/check/warehouse/order/list/amount`, { body: params })
  },
  postAgainSendSMSCode: (params) => {
    return http.get(`/crpt-credit/credit/hxd/send/sms/agian`, { values: params })
  },
  postVerify: (params) => {
    return http.post(`/crpt-credit/credit/hxd/assign/contract/apply`, { body: params }, {
      timeout: 10
    })
  },
}
export default service