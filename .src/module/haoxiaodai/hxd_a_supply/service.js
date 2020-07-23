import http from './../../../http'
// import { http } from './../../../config'

const service = {
  postCompanyInfo: (params, files) => {
    return http.upload(`/crpt-credit/credit/jf/company/completeInfo`, { values: params, files })
  }
}
export default service