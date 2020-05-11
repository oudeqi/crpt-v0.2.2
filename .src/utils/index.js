import Router from './router'

/**
 * Utils class
 * @authro liyang
 * @desc 工具类暴露的顶层api类，注入各class
 */
class Utils {
    constructor () {
        this.Router = new Router()
    }
}
export default new Utils()
