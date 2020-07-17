const dev = 'http://crptdev.liuheco.com'
const uat = 'https://gateway.crpt-cloud.liuheco.com'
const prod = 'https://gateway.crpt-cloud.app.oak.net.cn'

const ENV_URLS = {
  development: 'http://crptdev.liuheco.com',
  testing: 'https://gateway.crpt-cloud.liuheco.com',
  production: 'https://gateway.crpt-cloud.app.oak.net.cn'
}
export const baseUrl = ENV_URLS[__buildEnv__]
// export const baseUrl = __buildEnv__ === 'development' ? dev : __buildEnv__ === 'testing' ? uat : prod