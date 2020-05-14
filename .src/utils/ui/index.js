import {setPicker, setCityPicker} from "./picker";
import {showLoading, hideLoading} from './loading'
import {toast} from './toast'

/**
 * UI class
 * @author liyang
 * @desc UI类
 */
export default class UI {
    setPicker(params) {
        return setPicker(params)
    }
    setCityPicker(params) {
        return setCityPicker(params)
    }
    showLoading(params) {
        return showLoading(params)
    }
    hideLoading(params) {
        return hideLoading(params)
    }
    toast(params) {
        return toast(params)
    }
}
