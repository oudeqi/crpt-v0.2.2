import '../header.css'
import '../form.css'
import './index_copy.css'
import HeaderController from '../header.js'

apiready = function () {

  const headerController = new HeaderController()
  headerController.render()

}
