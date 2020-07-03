import http from './../../../http'

const service = {
  postCompanyInfo: (params, files) => {
    return http.upload(`/crpt-credit/credit/jf/company/completeInfo`, { values: params, files })
  }
}
export default service