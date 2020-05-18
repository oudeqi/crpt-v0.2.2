import './index.css'
import '../form.less'
import '../header.css'

apiready = function () {
  let el = $api.byId('step')
  setTimeout(() => {
    $api.removeCls(el, 'step2');
    $api.addCls(el, 'step3');
  }, 3000)

}
