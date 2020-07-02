import { themeMainColor, textColor, navigationBarWhite, navigationBarGreen } from './navbar-config'
import ouweiRouterMap from './routermap-ouwei'
import routerHXDConfig from './routermap-hxd'
import routerConfig from './routermap'

export default {
  ...routerHXDConfig,
  ...ouweiRouterMap,
  ...routerConfig
}