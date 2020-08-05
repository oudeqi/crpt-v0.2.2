import routerYJDConfig from './routermap-yjd'
import routerHXDConfig from './routermap-hxd'
import routerAccountConfig from './routermap-account'
import routerBaseConfig from './routermap'

export default {
  ...routerBaseConfig,
  ...routerAccountConfig,
  ...routerHXDConfig,
  ...routerYJDConfig
}