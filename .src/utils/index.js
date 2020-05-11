import Router from './router'
import UI from './ui'
/**
 * Utils class
 * @authro liyang
 * @desc 工具类暴露的顶层api类，注入各class
 */
class Utils {
    constructor () {
        this.Router = new Router()
        this.UI = new UI()
    }
}
export default new Utils()
