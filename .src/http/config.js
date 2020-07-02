const dev = 'http://crptdev.liuheco.com'
const uat = 'https://gateway.test.crpt-cloud.liuheco.com'
const prod = 'https://gateway.crpt-cloud.app.oak.net.cn'


export const baseUrl = __buildEnv__ === 'development' ? dev : __buildEnv__ === 'testing' ? uat : prod