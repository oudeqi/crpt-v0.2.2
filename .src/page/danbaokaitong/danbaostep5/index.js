import '../header.css'
import '../form.css'
import './index.css'
import HeaderController from '../header.js'
import { openDanbaoKaitong } from '../../../webview.js'

apiready = function () {

  const headerController = new HeaderController()
  headerController.renderHeaderAndGetDanbaoStatus()

  $api.byId('next').onclick = function () {
    openDanbaoKaitong({step: 6})
  }

}
