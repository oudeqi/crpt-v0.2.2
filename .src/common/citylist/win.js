import { CityList } from '../../config.js'

apiready = function () {
  let statusBar = $api.byId('statusBar')
  $api.fixStatusBar(statusBar)
  let statusBarPos = $api.offset(statusBar)
  let pageParam = api.pageParam || {}
  let { eventName } = pageParam
  CityList({ x: 0, y: statusBarPos.h + 45 }, selected => {
    api.sendEvent({
      name: eventName,
      extra: selected
    })
    api.closeWin()
  })
}
