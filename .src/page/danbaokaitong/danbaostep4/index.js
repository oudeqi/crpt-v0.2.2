import '../header.css'
import '../form.css'
import './index.css'
import HeaderController from '../header.js'
import { openDanbaoKaitong } from '../../../webview.js'

apiready = function () {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  const headerController = new HeaderController()
  headerController.renderHeaderAndGetDanbaoStatus()

  $api.byId('next').onclick = function () {
    openDanbaoKaitong({step: 5})
  }

}
