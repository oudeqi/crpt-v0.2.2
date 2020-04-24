import { CityList } from '../../config.js'

apiready = function () {
  let statusBar = $api.byId('statusBar')
  $api.fixStatusBar(statusBar)
  let statusBarPos = $api.offset(statusBar)
  let pageParam = api.pageParam || {}
  let { eventName } = pageParam
  let systemType = api.systemType;
  // ios            //iOS系统
  // android        //Android系统
  // win            //Windows系统
  // wp             //Windows Phone系统
  let timeout = 0
  if (systemType === 'android') {
    timeout = 300
  }
  setTimeout(function () {
    CityList({ x: 0, y: statusBarPos.h + 44 }, selected => {
      api.sendEvent({
        name: eventName,
        extra: selected
      })
      api.closeWin()
    })
  }, timeout)
}
