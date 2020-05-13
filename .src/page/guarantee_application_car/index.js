import Utils from './../../utils'
import '../../app.css'
import './index.less'
import {ActionSheet, getPicture} from "../../config";

/**
 * @authro liyang
 * @desc 担保业务申请表录入页Page 类
 * @class PageController类，需继承Service类
 */
class PageController {
    constructor(props) {
        //  所有表单域预置信息
        this.profile = {
            // upload参数
            uploadImgType: {
                0: 'camera',
                1: 'album'
            }
        }
        //  统一管理数据model data
        this.data = {}
    }
    //  执行函数
    main(props) {
        this._initData()
        this._bindEvents()
    }
    //  事件绑定入口
    _bindEvents() {
        const self = this
    }
    _initData() {}

}

apiready = function() {
    let pageParam = api.pageParam || {};
    api.setStatusBarStyle({
        style: 'dark'
    });
    new PageController().main()
};
