import {http} from './../../config'

export default class Service {
    constructor() {
        this.ajaxUrls = {
            getAttachmentUrl: '/crpt-guarantee/gt/attachment/list',
            deleteAttachmentUrl: '/crpt-guarantee/gt/attachment/delete',
            saveAttachmentUrl: '/crpt-guarantee/gt/attachment/save',
            updateAttachmentUrl: '/crpt-guarantee/gt/attachment/update',
            submitAttachmentUrl: '/crpt-guarantee/gt/attachment/submit',
            submitInfoUrl: '/crpt-guarantee/gt/attachment/submit',
            getFileContentType: '/crpt-biz/dict/codelist'
        }
    }

    postAttachment(params) {
        return http.post(this.ajaxUrls.postAttachmentUrl, {body: params}, {
            // headers: {
            //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46',
            //     'Content-Type': 'application/json'
            // },
            timeout: 3000
        })
    }

    getAttachment(params) {
        return http.get(this.ajaxUrls.getAttachmentUrl, {values: params}, {
            // headers: {
            //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            // },
            timeout: 3000
        })
    }

    deleteAttachment(params) {
        return http.get(this.ajaxUrls.deleteAttachmentUrl, {values: params}, {
            // headers: {
            //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            // },
            timeout: 3000
        })
    }

    saveAttachment(params, files) {
        return http.upload(this.ajaxUrls.saveAttachmentUrl, {values: params, files}, {
            // headers: {
            //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            // },
            timeout: 3000
        })
    }

    updateAttachment(params, files) {
        return http.upload(this.ajaxUrls.updateAttachmentUrl, {values: params, files}, {
            // headers: {
            //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            // },
            timeout: 3000
        })
    }

    submitInfo(params) {
        return http.get(this.ajaxUrls.submitInfoUrl, {values: params}, {
            // headers: {
            //     token: 'Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46'
            // },
            timeout: 3000
        })
    }

    getCodeList(params) {
        return http.post(this.ajaxUrls.getFileContentType, {body: params}, {
            timeout: 3000
        })
    }
}
