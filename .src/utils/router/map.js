import { navigationBarProfile } from './navigation.profile'

/**
 * 打开授信资料录入页面
 */
export function openPageCreditInformation() {
    api.openTabLayout({
        title: '授信资料录入',
        name: 'html/credit_information/index',
        url: 'widget://html/credit_information/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        slidBackEnabled: false,
        animation: {
            type: 'none'
        },
        navigationBar: navigationBarProfile
    })
}
/**
 * 打开担保业务申请表页面
 */
export function openGuaranteeApplicationIndex() {
    api.openTabLayout({
        title: '担保业务申请表',
        name: 'html/guarantee_application_index/index',
        url: 'widget://html/guarantee_application_index/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        slidBackEnabled: false,
        useWKWebView: true,
        animation: {
            type: 'none'
        },
        navigationBar: navigationBarProfile
    })
}
