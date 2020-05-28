import Router from './router'
<<<<<<< HEAD
import UI from './ui'
import File from './file'
import DictFilter from './dict_filter'
import OCR from './ocr'
/**
 * Utils class
 * @authro liyang
 * @desc 工具类暴露的顶层api类，注入各class
 */
class Utils {
    constructor () {
        this.Router = new Router()
        this.UI = new UI()
        this.File = new File()
        this.DictFilter = DictFilter
        this.OCR = OCR
=======

class Utils {
    constructor () {
        this.Router = new Router()
>>>>>>> c8ac6dbe75536b43ec11782d2f6bad6ae1517b0c
    }
}
export default new Utils()
