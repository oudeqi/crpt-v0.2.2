import {http} from './../../../config'

export default class BaiduSDK {
    constructor() {
        this.ajaxUrls = {
            URL_TOKEN: "/crpt-biz/saas/query/accesstoken",
            URL_BANK_INFO: "/crpt-biz/saas/query/bankcardinfo",
            URL_IDCARD_INFO: "/crpt-biz/saas/query/certinfo",
            URL_CAR_INFO: "/crpt-biz/saas/query/carinfo",
        }
    }

    getToken() {
        return http.get(this.ajaxUrls.URL_TOKEN, null, {
            headers: {}
        });
    }

    async CarVerify(files) {
        const self = this
        const res = await this.getToken();
        if (res.code === 200) {
            return http.upload(
                `${self.ajaxUrls.URL_CAR_INFO}?accessToken=${res.data.accessToken}`,
                {files},
                {
                    headers: {},
                    timeout: 3000
                }
            );
        }
        return Promise.reject(res)
    }

    async IdcardVerify(files) {
        const self = this
        const res = await this.getToken();
        if (res.code === 200) {
            return http.upload(
                `${this.ajaxUrls.URL_IDCARD_INFO}?accessToken=${res.data.accessToken}`,
                {files},
                {
                    headers: {},
                    timeout: 3000
                }
            );
        }
    }

    async BankVerify(files) {
        const res = await BaiduSDK.getToken();
        if (res.code === 200) {
            return http.post(
              `${this.ajaxUrls.URL_BANK_INFO}?accessToken=${res.data.accessToken}`,
              {files},
              {
                  headers: {},
                  timeout: 3000
              }
            );
        }
        return Promise.reject(res)
    }
}

export const obj2FormData = (info) => {
    const formData = new FormData()
    Object.keys(info).forEach((k, i) => {
        formData.append(k, info[k])
    })
    return formData
}
