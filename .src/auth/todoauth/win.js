import '../../app.css'
import './win.css'

import {
  openRegLogin, openBaseinfoFill, openCompanyInfo,
  openFaceAuth, openYuguEdu
} from '../../webview.js'

apiready = function() {
  api.parseTapmode()

  document.querySelector('#baseinfo').onclick = function () {
    openBaseinfoFill()
  }

  document.querySelector('#companyinfo').onclick = function () {
    openCompanyInfo()
  }

  document.querySelector('#faceauth').onclick = function () {
    openFaceAuth()
  }

  document.querySelector('#yuguedu').onclick = function () {
    openYuguEdu()
  }




}
