import '../header.css'
import '../form.css'
import './index.css'
import HeaderController from '../header.js'
import { openTabLayout } from '../../../webview.js'

apiready = function () {

  const headerController = new HeaderController()
  headerController.renderHeaderAndGetDanbaoStatus()

  $api.byId('next').onclick = function () {
    api.closeWin({ name: 'tabLayout' })
    openTabLayout(1)
  }

}
