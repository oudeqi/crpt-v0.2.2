import Utils from './../../utils'
import '../../app.css'
import './index.less'
import Service from './service'
import {baseUrl} from './../../config'

/**
 * @authro liyang
 * @desc 担保业务申请表录入页Page 类
 * @class PageController类，需继承Service类
 */
class PageController extends Service {
    constructor(props) {
        super()
        //  所有表单域预置信息
        this.profile = {
            // upload参数
            uploadImgType: {
                0: 'camera',
                1: 'album'
            },
            remap: {
                approvalStatus: {
                    0: '',
                    1: '待审核',
                    2: '已审核',
                    3: '已作废'
                }
            },
            fileContentType: {}
        }
        //  统一管理数据model data
        this.data = {
            gtId: props.pageParam.gtId,
            flowStatus: props.pageParam.flowStatus,
            gtCreditId: props.pageParam.gtCreditId,
            attachmentList: [{
                attachId: '',
                // gtId: '',
                fileId: '',
                productFileId: '',
                productFileRequire: '',
                fileComment: '',
                fileContentType: '',
                approvalStatus: '',
                // approvalPersonName: '',
                // createDate: '',
                // updateDate: ''
            }]
        }
    }

    //  执行函数
    main(props) {
        this.initData()
        this.bindEvents()
    }

    //  事件绑定入口
    bindEvents() {
        this.bindAddEvents()
        this.bindDelEvents()
        this.bindImageClickEvents()
        this.bindSaveBtnClickEvents()
        this.bindPreviewBoxEvents()
        this.bindClearPreviewEvents()
        this.bindSubmitEvents()
        // this.bindSubmitEvents()
    }

    async initData() {
        const self = this
        Utils.UI.showLoading('加载中')
        // 1. 先获取附件类型字典
        try {
            const codeRes = await this.getCodeList({
                type: "fileContentType",
                valid: 1
            })
            self.profile.fileContentType = Utils.DictFilter(codeRes.data)

        } catch (e) {
            console.log(e)
        }
        try {
            const res = await this.getAttachment({
                gtId: this.data.gtId
            })
            this.data.attachmentList = res.data.length > 0 ? res.data : [{
                attachId: '',
                // gtId: '',
                fileId: '',
                productFileId: '',
                productFileRequire: '',
                fileComment: '',
                fileContentType: '',
                approvalStatus: '',
                // approvalPersonName: '',
                // createDate: '',
                // updateDate: ''
            }]
        } catch (e) {
            Utils.UI.toast('服务超时')
        }
        this.compilerTemplate(this.data.attachmentList)
        Utils.UI.hideLoading()
    }

    //  绑定add事件
    bindAddEvents() {
        const self = this
        const addBtn = document.querySelector('#add-btn')
        addBtn.onclick = function () {
            self.searchAllData()
            self.data.attachmentList.push({
                attachId: '',
                // gtId: '',
                fileId: '',
                productFileId: '',
                productFileRequire: '',
                fileComment: '',
                fileContentType: 0,
                approvalStatus: '',
                // approvalPersonName: '',
                // createDate: '',
                // updateDate: ''
            })
            self.compilerTemplate((self.data.attachmentList))
        }
    }

    //  绑定图片点击事件
    bindImageClickEvents() {
        const self = this
        document.querySelector('#img-bind-doc').onclick = async function (e) {
            let ev = window.event || e;
            if (ev.target.classList.contains('a-img-url')) {
                let _i = ev.target.getAttribute('data-index')
                //  1. 如果有图片，则预览
                // alert(self.data.attachmentList[_i].fileId)
                if (self.data.attachmentList[_i].fileId) {
                    document.querySelector('#preview').classList.remove('hidden')
                    document.querySelector('#pv-img').src = ev.target.getAttribute('src')
                    self.data.currentPreviewIndex = _i
                } else {
                    // 上传
                    Utils.File.actionSheet('请选择', ['相机', '相册'], function (index) {
                        Utils.File.getPicture(self.profile.uploadImgType[index], function (res, err) {
                            if (res) {
                                if (res.data) {
                                    self.data.attachmentList[_i].fileDataStream = res.data
                                    ev.target.src = res.data;
                                    Utils.UI.toast('上传成功')
                                } else {
                                    Utils.UI.toast('未上传成功')
                                }
                            }
                        })
                    })
                }
            }
        }
    }

    // 绑定附件保存按钮
    bindSaveBtnClickEvents() {
        const self = this
        document.querySelector('#save-bind-doc').onclick = async function (e) {
            let ev = window.event || e;
            if (ev.target.classList.contains('update')) {
                let _i = ev.target.getAttribute('data-index')
                // 先刷一遍本地离线备份
                self.searchAllData()
                Utils.UI.showLoading('提交中...')
                try {
                    //  1. 如果有attachId，则为更新
                    if (self.data.attachmentList[_i].attachId) {
                        const res = await self.updateAttachment({
                            gtId: self.data.gtId,
                            attachId: self.data.attachmentList[_i].attachId,
                            fileComment: self.data.attachmentList[_i].fileComment
                        }, {
                            fileDataStream: self.data.attachmentList[_i].fileDataStream
                        })
                        self.data.attachmentList[_i].fileId = res.data.fileId
                        self.data.attachmentList[_i].approvalStatus = 1
                        self.compilerTemplate(self.data.attachmentList)
                        Utils.UI.toast('操作成功')

                    } else { // 2. 否则为新建
                        const res = await self.saveAttachment({
                            gtId: self.data.gtId,
                            fileContentType: self.data.attachmentList[_i].fileContentType || 0,
                            fileComment: self.data.attachmentList[_i].fileComment,
                            productFileId: self.data.attachmentList[_i].productFileId || ''
                        }, {
                            fileDataStream: self.data.attachmentList[_i].fileDataStream
                        })
                        self.data.attachmentList[_i].attachId = res.data.attachId
                        self.data.attachmentList[_i].fileId = res.data.fileId
                        self.data.attachmentList[_i].approvalStatus = 1
                        self.compilerTemplate(self.data.attachmentList)
                        Utils.UI.toast('操作成功')
                    }
                } catch (e) {
                    Utils.UI.toast(e.msg || '出错啦')
                }
                Utils.UI.hideLoading()
            }
        }
    }

    // 绑定删除事件
    bindDelEvents() {
        const self = this
        document.querySelector('#credit-list').onclick = async function (e) {
            let ev = window.event || e;
            if (ev.target.classList.contains('del')) {
                //  删除前需将model-tree检出，防止数据直接被抹除
                self.searchAllData()
                let index = ev.target.getAttribute('data-index')

                if(!self.data.attachmentList[index].attachId && self.data.attachmentList[index].fileContentType === 0) {
                    self.data.attachmentList.splice(index, 1)
                    self.compilerTemplate(self.data.attachmentList)
                    return
                }
                // 分情况进行删除
                // 1. 产品自带的附件，删除调用后端接口
                Utils.UI.showLoading('正在删除...')
                try {
                  if (self.data.attachmentList[index].fileContentType >= 1) {
                      // 数据库 delte
                      const res = await self.deleteAttachment({
                          gtId: self.data.gtId,
                          attachId: self.data.attachmentList[index].attachId
                      })
                      // 本地离线备份 重置 reset
                      Object.assign(self.data.attachmentList[index], {
                          attachId: '',
                          fileId: '',
                          fileComment: '',
                          approvalStatus: 0
                      })
                  } else { // 2. 自定义附件，直接删除本地数据和dom，并调用后端删除接口
                      // 数据库 delete
                      const res = await self.deleteAttachment({
                          gtId: self.data.gtId,
                          attachId: self.data.attachmentList[index].attachId
                      })
                      // 本地离线备份直接 delete
                      self.data.attachmentList.splice(index, 1)
                  }
                  self.compilerTemplate(self.data.attachmentList)
                } catch (error) {
                  api.toast({ msg: error.msg || '保存成功', location: 'middle' })

                }
                Utils.UI.hideLoading()
            }
        }
    }

    // 绑定预览图遮罩事件
    bindPreviewBoxEvents() {
        document.querySelector('#preview').onclick = function (e) {
            let ev = window.event || e
            if (e.target.id === 'preview') {
                this.classList.add('hidden')
            }
        }
    }

    //  绑定清空附件预览图
    bindClearPreviewEvents() {
        const self = this
        document.querySelector('#pv-img-del').onclick = function () {
            Object.assign(self.data.attachmentList[self.data.currentPreviewIndex], {
                fileId: '',
                fileDataStream: ''
            })
            self.searchAllData()
            self.compilerTemplate(self.data.attachmentList)
            document.querySelector('#preview').classList.add('hidden')
        }
    }

    //  提交总表单事件
    bindSubmitEvents() {
        const self = this
        document.querySelector('#save-btn').onclick = async function () {
            Utils.UI.showLoading('提交中')
            try {
                const res = await self.submitInfo({
                    gtId: self.data.gtId
                })
                Utils.UI.toast('操作成功')
                Utils.Router.closeCurrentWinAndRefresh({
                    winName: 'html/danbaostep2/index',
                    script: 'window.location.reload();'
                })
            } catch (e) {
                Utils.UI.toast(e.msg)
            }
            Utils.UI.hideLoading()
        }
    }

    // 检索出当前所有填充在input中的model-tree，防止删除或新增时，将未保存的数据抹掉
    searchAllData() {
        const self = this
        const newAttachmentList = self.data.attachmentList.map((item, i) => {
            return {
                ...item,
                fileComment: document.querySelector(`#fileComment_${i}`).value
            }
        })
        this.data.attachmentList = newAttachmentList
    }


    // 编译html模板
    compilerTemplate(list) {
        const self = this
        const _html = list.reduce((prev, item, i) => {
            return prev + `<div class="cl-cell">
        <div class="cl-cell_box cl_h_bd">
            <div class="cl-cell_text single">
                <span class="clt_main">${!!item.fileContentType ? self.profile.fileContentType[item.fileContentType] : "附件<b>" + (i + 1) + "</b>"} <b class="b-status s_${item.approvalStatus
            || 0}">${self.profile.remap.approvalStatus[item.approvalStatus || 0]}</b> </span>
                <div>
                    <a class="update" data-index="${i}">保存当前附件</a>
                    <a class="del" data-index="${i}">删除</a>
                </div>
            </div>
        </div>

        <div class="form-body">
            <div class="form-cell_shell" data-index="${i}">
                <div class="a-img">
                    <span class="def"></span>
                    <img class="a-img-url" src="${baseUrl}/crpt-file/file/download/${item.fileId}" alt="" id="fileId_${i}" data-index="${i}">
                </div>
                <div class="a-text-box">
                    <textarea class="a-desc" name="" id="fileComment_${i}" cols="30" rows="10" data-index="${i}">${item.fileComment || ''}</textarea>
                    <span class="a-count">${item.fileComment && item.fileComment.length || 0}/50</span>
                </div>
            </div>
        </div>
    </div>`
        }, '')
        document.querySelector('#credit-list').innerHTML = _html
    }
}

apiready = function () {
    let pageParam = api.pageParam || {};
    api.setStatusBarStyle({
        style: 'dark'
    });
    new PageController({pageParam}).main()
};
