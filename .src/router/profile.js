import { themeMainColor, textColor, navigationBarWhite, navigationBarGreen } from './navbar-config'
import ouweiRouterMap from './routermap-ouwei'
import routerHXDConfig from './routermap-hxd'

export default {
  ...routerHXDConfig,
  ...ouweiRouterMap
}