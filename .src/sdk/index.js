import BaiduFace from './baidu_face'
/**
 * Utils class
 * @authro liyang
 * @desc 工具类暴露的顶层api类，注入各class
 */
class SDK {
    constructor () {
        this.BaiduFace = new BaiduFace()
    }
}

export default new SDK()
