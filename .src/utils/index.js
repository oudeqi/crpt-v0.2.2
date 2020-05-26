import Router from './router'
import UI from './ui'
import File from './file'
import DictFilter from './dict_filter'
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
    }
}
export default new Utils()
