import '../header.css'
import '../form.css'
import './index.css'
import HeaderController from '../header.js'

apiready = function () {

  const headerController = new HeaderController()
  headerController.renderHeader()
}
