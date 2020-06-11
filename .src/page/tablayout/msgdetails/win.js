import '../../../app.css'
import './win.css'

import { openLeftPane } from '../../../webview.js'

apiready = function () {
    api.addEventListener({
        name: 'navitembtn'
    }, function (ret, err) {
        if (ret.type === 'left') {
            api.closeWin();
        }
    });

}
