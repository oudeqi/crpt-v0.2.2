import { http } from '../../config.js'
const filterDict  = (type) => {
  const Obj = {}
  const sendJson = {
    type: type,
    valid: 1
  }
  return http.post('/crpt-biz/dict/codelist', { body: sendJson }).then(res => {
    res.data.map(item => {
      Obj[item.code] = item.name
    })
    return Obj
  })
}
export default filterDict