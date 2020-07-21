const ENV_URLS = {
  development: 'http://crptdev.liuheco.com',
  testing: 'https://gateway.crpt-cloud.liuheco.com',
  production: 'https://gateway.crpt-cloud.app.oak.net.cn'
}
export const baseUrl = ENV_URLS[__buildEnv__]