import '../../app.css'
import './index.less'
import { http } from '../../config.js'

apiready = function() {
    let pageParam = api.pageParam || {}
    let { id, type } = pageParam // '9939393'
    // var header = document.querySelector('#header');
    // $api.fixStatusBar(header);
    api.setStatusBarStyle({
        style: 'dark'
    })
}
