import http from './../../../http'


const service = {
  getChangeList: (params) => {
    return http.get(`/crpt-credit/credit/amount/changeList`, { values: params })
  }
}
export default service